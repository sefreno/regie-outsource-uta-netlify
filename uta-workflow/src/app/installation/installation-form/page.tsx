"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { InstallationForm } from "@/components/installation/installation-form";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Données fictives pour les installations
const MOCK_INSTALLATIONS = [
  {
    id: "INST001",
    client: {
      id: "C12345",
      name: "Jean Dupont",
      address: "123 Rue de la Paix, 75001 Paris",
      phone: "06 12 34 56 78",
      email: "jean.dupont@example.com",
      propertyType: "Appartement",
      propertySize: "80",
      installationType: "Pompe à chaleur air/eau",
      administrativeNotes: "Installation prévue après validation technique.",
    },
    date: "2023-05-15",
    status: "pending" as const,
  },
  {
    id: "INST002",
    client: {
      id: "C12346",
      name: "Marie Lambert",
      address: "45 Avenue des Fleurs, 69002 Lyon",
      phone: "06 23 45 67 89",
      email: "marie.lambert@example.com",
      propertyType: "Maison",
      propertySize: "120",
      installationType: "Isolation des combles",
      administrativeNotes: "Accès facile aux combles. Client disponible toute la journée.",
    },
    date: "2023-05-18",
    status: "scheduled" as const,
  },
  {
    id: "INST003",
    client: {
      id: "C12347",
      name: "Sophie Dubois",
      address: "12 Rue du Faubourg, 31000 Toulouse",
      phone: "06 34 56 78 90",
      email: "sophie.dubois@example.com",
      propertyType: "Appartement",
      propertySize: "65",
      installationType: "Remplacement fenêtres",
      administrativeNotes: "Appartement au 3ème étage sans ascenseur. Prévoir monte-charge.",
    },
    date: "2023-05-10",
    status: "completed" as const,
  },
  {
    id: "INST004",
    client: {
      id: "C12348",
      name: "Thomas Bernard",
      address: "3 Place de la République, 44000 Nantes",
      phone: "06 45 67 89 01",
      email: "thomas.bernard@example.com",
      propertyType: "Maison",
      propertySize: "150",
      installationType: "Isolation murs extérieurs",
      administrativeNotes: "Demande d'autorisation à la mairie en cours. Vérifier avant installation.",
    },
    date: "2023-05-20",
    status: "pending" as const,
  },
  {
    id: "INST005",
    client: {
      id: "C12349",
      name: "Paul Martin",
      address: "8 Boulevard Haussman, 75008 Paris",
      phone: "06 56 78 90 12",
      email: "paul.martin@example.com",
      propertyType: "Appartement",
      propertySize: "95",
      installationType: "Système de ventilation",
      administrativeNotes: "Accord du syndic nécessaire. Documents fournis.",
    },
    date: "2023-05-05",
    status: "rescheduled" as const,
  },
];

export default function InstallationFormPage() {
  const searchParams = useSearchParams();
  const installationId = searchParams.get("id") || "";

  const [loading, setLoading] = useState(true);
  const [installation, setInstallation] = useState<(typeof MOCK_INSTALLATIONS)[0] | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [signaturesPreviews, setSignaturesPreviews] = useState<{
    client: string | null;
    installer: string | null;
  }>({
    client: null,
    installer: null
  });

  // Ajouter une nouvelle state pour les photos avant/après
  const [installationGallery, setInstallationGallery] = useState<{
    before: string[] | null;
    after: string[] | null;
  }>({
    before: null,
    after: null
  });

  // Simuler un chargement de données
  useEffect(() => {
    const timer = setTimeout(() => {
      const foundInstallation = MOCK_INSTALLATIONS.find(i => i.id === installationId) || null;
      setInstallation(foundInstallation);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [installationId]);

  // Gestionnaire pour la soumission du formulaire d'installation
  const handleSubmitInstallation = (
    data: any,
    photos: any[],
    signatures: {
      client: string;
      installer: string;
      installationPhotos: {
        before: any[];
        after: any[];
      }
    }
  ) => {
    console.log("Formulaire d'installation soumis avec les données:", data);
    console.log("Photos téléchargées:", photos);
    console.log("Signatures:", signatures);
    console.log("Photos avant/après:", signatures.installationPhotos);

    // Enregistrer les signatures pour affichage ultérieur
    setSignaturesPreviews({
      client: signatures.client,
      installer: signatures.installer
    });

    // Enregistrer les photos avant/après pour affichage
    setInstallationGallery({
      before: signatures.installationPhotos.before.map(file => URL.createObjectURL(file)),
      after: signatures.installationPhotos.after.map(file => URL.createObjectURL(file))
    });

    // Marqueur de formulaire soumis
    setFormSubmitted(true);

    // Afficher une notification
    toast({
      title: "Installation confirmée",
      description: "Le rapport d'installation a bien été enregistré avec les signatures et photos.",
      variant: "success"
    });

    // Dans une application réelle, vous enverriez ces données à votre backend
    // et vous redirigeriez probablement l'utilisateur
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
              <p>Chargement des données de l'installation...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!installation) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="flex items-center mb-6">
              <Button variant="outline" className="mr-4" asChild>
                <Link href="/installation/dashboard">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Retour au tableau de bord
                </Link>
              </Button>
            </div>

            <div className="text-center p-10 border border-dashed border-gray-700 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Installation introuvable</h3>
              <p className="text-gray-400">
                L'installation avec l'identifiant <span className="font-mono">{installationId}</span> n'a pas été trouvée.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/installation/dashboard">
                  Retour au tableau de bord
                </Link>
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center">
                <Button variant="outline" className="mr-4" asChild>
                  <Link href="/installation/dashboard">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Retour au tableau de bord
                  </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">
                  Formulaire d'installation
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="text-gray-400">Date prévue:</span>{" "}
                  <span className="font-medium">{new Date(installation.date).toLocaleDateString('fr-FR')}</span>
                </div>

                <Button
                  variant="default"
                  className="button-highlight"
                  asChild
                >
                  <Link href={`/installation/dashboard?edit=${installationId}`}>
                    Modifier l'installation
                  </Link>
                </Button>
              </div>
            </div>

            {formSubmitted && (
              <Alert className="bg-green-900/20 border border-green-900/30">
                <AlertTitle className="text-green-500">Installation complétée avec succès</AlertTitle>
                <AlertDescription>
                  <p>Le formulaire d'installation a été enregistré avec toutes les signatures requises.</p>
                  {signaturesPreviews.client && signaturesPreviews.installer && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Signature du client:</p>
                        <img
                          src={signaturesPreviews.client}
                          alt="Signature du client"
                          className="border border-green-900/30 rounded-md bg-black/40 max-w-[200px]"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Signature de l'installateur:</p>
                        <img
                          src={signaturesPreviews.installer}
                          alt="Signature de l'installateur"
                          className="border border-green-900/30 rounded-md bg-black/40 max-w-[200px]"
                        />
                      </div>
                    </div>
                  )}
                  {installationGallery.before && installationGallery.before.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Photos avant installation:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {installationGallery.before.slice(0, 3).map((url, index) => (
                          <div key={`before-${index}`} className="aspect-square relative border border-green-900/30 rounded-md overflow-hidden">
                            <img
                              src={url}
                              alt={`Photo avant ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                        {installationGallery.before.length > 3 && (
                          <div className="aspect-square flex items-center justify-center border border-green-900/30 rounded-md bg-black/40">
                            <span className="text-sm text-green-500">+{installationGallery.before.length - 3} photos</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {installationGallery.after && installationGallery.after.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Photos après installation:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {installationGallery.after.slice(0, 3).map((url, index) => (
                          <div key={`after-${index}`} className="aspect-square relative border border-green-900/30 rounded-md overflow-hidden">
                            <img
                              src={url}
                              alt={`Photo après ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                        {installationGallery.after.length > 3 && (
                          <div className="aspect-square flex items-center justify-center border border-green-900/30 rounded-md bg-black/40">
                            <span className="text-sm text-green-500">+{installationGallery.after.length - 3} photos</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <InstallationForm
              clientName={installation.client.name}
              propertyAddress={installation.client.address}
              installationId={installationId}
              installationType={installation.client.installationType}
              onSubmit={handleSubmitInstallation}
              initialData={{
                // Vous pourriez charger des données existantes ici si le formulaire avait déjà été rempli
                clientEmail: installation.client.email,
                clientPhone: installation.client.phone,
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
