"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, CheckCircle, Map, Search } from "lucide-react";
import { debounce } from 'lodash';

// Type pour les résultats de la géolocalisation
interface GeocodingResult {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number]; // [lng, lat]
  postalCode?: string;
  city?: string;
  country?: string;
  formattedAddress: string;
}

interface AddressVerificationProps {
  initialAddress?: string;
  onAddressSelect: (addressData: GeocodingResult) => void;
  required?: boolean;
  label?: string;
  description?: string;
}

// Clé API Mapbox (En production, cela devrait être dans une variable d'environnement)
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNrcTEwbGEwdDBhMXgydm1ubjBlbHZkbzEifQ.3mBOEjbiXkwBTWjRgkKnRQ";

export function AddressVerification({
  initialAddress = "",
  onAddressSelect,
  required = false,
  label = "Adresse",
  description = "Entrez l'adresse et sélectionnez la suggestion correcte pour confirmer"
}: AddressVerificationProps) {
  const [address, setAddress] = useState(initialAddress);
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<GeocodingResult | null>(null);
  const [showMap, setShowMap] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Fonction pour rechercher des adresses via l'API de géocodage
  const searchAddress = async (query: string) => {
    if (!query || query.length < 5) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // En production, cette requête devrait être faite via votre propre backend pour sécuriser la clé API
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=fr&language=fr&limit=5&types=address`);

      if (!response.ok) {
        throw new Error(`Erreur lors de la recherche d'adresse: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const formattedResults: GeocodingResult[] = data.features.map((feature: any) => {
          // Extraction des composants d'adresse
          const postalCode = feature.context?.find((ctx: any) => ctx.id.startsWith('postcode'))?.text;
          const city = feature.context?.find((ctx: any) => ctx.id.startsWith('place'))?.text;
          const country = feature.context?.find((ctx: any) => ctx.id.startsWith('country'))?.text;

          return {
            id: feature.id,
            name: feature.text || "",
            address: feature.place_name || "",
            coordinates: feature.center, // [longitude, latitude]
            postalCode,
            city,
            country,
            formattedAddress: feature.place_name,
          };
        });

        setSuggestions(formattedResults);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      setError("Erreur lors de la recherche d'adresse");
      console.error("Erreur de géocodage:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce la recherche pour éviter trop d'appels API
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => searchAddress(query), 500),
    []
  );

  // Mettre à jour les suggestions lorsque l'adresse change
  useEffect(() => {
    debouncedSearch(address);
  }, [address, debouncedSearch]);

  // Initialisation de la carte lorsque showMap passe à true
  useEffect(() => {
    if (!showMap || !selectedAddress || !mapContainerRef.current) return;

    // Vérifie si mapboxgl est déjà chargé
    if (typeof window !== "undefined" && !window.mapboxgl) {
      // Charger Mapbox de manière dynamique
      const script = document.createElement("script");
      script.src = "https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js";
      script.async = true;
      script.onload = initializeMap;
      document.body.appendChild(script);

      // Charger les styles CSS de Mapbox
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css";
      document.head.appendChild(link);
    } else {
      // Si mapboxgl est déjà chargé, initialiser la carte directement
      initializeMap();
    }

    function initializeMap() {
      if (!mapContainerRef.current || !selectedAddress) return;

      if (typeof window !== "undefined" && window.mapboxgl) {
        window.mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

        // Initialiser la carte
        if (!mapRef.current) {
          mapRef.current = new window.mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: selectedAddress.coordinates,
            zoom: 15,
          });

          // Ajouter les contrôles de navigation
          mapRef.current.addControl(new window.mapboxgl.NavigationControl(), "top-right");
        } else {
          // Si la carte existe déjà, on met juste à jour le centre
          mapRef.current.setCenter(selectedAddress.coordinates);
        }

        // Supprimer un marquer existant s'il y en a un
        if (markerRef.current) {
          markerRef.current.remove();
        }

        // Ajouter un marqueur à l'adresse sélectionnée
        markerRef.current = new window.mapboxgl.Marker({ color: "#FF0000" })
          .setLngLat(selectedAddress.coordinates)
          .addTo(mapRef.current);
      }
    }

    // Nettoyage lors du démontage
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [showMap, selectedAddress]);

  // Sélection d'une adresse suggérée
  const handleSelectAddress = (result: GeocodingResult) => {
    setSelectedAddress(result);
    setAddress(result.formattedAddress);
    setSuggestions([]);
    onAddressSelect(result);
    setShowMap(true);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="address-input" className="flex items-center">
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Map className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="address-input"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Entrez une adresse complète"
            className="pl-10 bg-gray-800 border-gray-700"
            required={required}
          />
          {isLoading && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              <Spinner className="h-4 w-4 text-primary" />
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">{description}</p>

        {error && (
          <div className="text-red-400 text-sm mt-2 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
      </div>

      {/* Résultats de suggestion */}
      {suggestions.length > 0 && (
        <div className="mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {suggestions.map((result) => (
              <li
                key={result.id}
                className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
                onClick={() => handleSelectAddress(result)}
              >
                <div className="font-medium">{result.formattedAddress}</div>
                {result.postalCode && result.city && (
                  <div className="text-sm text-gray-400">
                    {result.postalCode}, {result.city}, {result.country}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Adresse sélectionnée */}
      {selectedAddress && (
        <div className="mt-4 p-3 bg-gray-800 border border-gray-700 rounded-md">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">Adresse confirmée</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? "Masquer la carte" : "Voir sur la carte"}
            </Button>
          </div>
          <p className="text-sm">{selectedAddress.formattedAddress}</p>
          {(selectedAddress.postalCode || selectedAddress.city) && (
            <p className="text-xs text-gray-400 mt-1">
              {selectedAddress.postalCode && `${selectedAddress.postalCode}, `}
              {selectedAddress.city && `${selectedAddress.city}, `}
              {selectedAddress.country}
            </p>
          )}
          <div className="text-xs text-gray-400 mt-1">
            Coordonnées: {selectedAddress.coordinates[1].toFixed(6)}, {selectedAddress.coordinates[0].toFixed(6)}
          </div>
        </div>
      )}

      {/* Carte de visualisation */}
      {showMap && selectedAddress && (
        <div className="mt-4 rounded-md overflow-hidden border border-gray-700" style={{ height: '300px' }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
        </div>
      )}
    </div>
  );
}
