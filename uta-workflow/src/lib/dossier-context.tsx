"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";
import type { Dossier, DossierStatus, Document, HomeDetails, ClientEligibility } from "./types";

interface DossierContextType {
  dossiers: Dossier[];
  loading: boolean;
  createDossier: (dossier: Partial<Dossier>) => Promise<Dossier>;
  updateDossier: (id: string, updates: Partial<Dossier>) => Promise<Dossier>;
  transferDossier: (id: string, newStatus: DossierStatus) => Promise<Dossier>;
  getDossier: (id: string) => Dossier | undefined;
  getDossiersByStatus: (status: DossierStatus) => Dossier[];
  addDocument: (dossierId: string, document: Document) => Promise<Dossier>;
  setEligibility: (dossierId: string, eligibility: ClientEligibility) => Promise<Dossier>;
  setHomeDetails: (dossierId: string, details: HomeDetails) => Promise<Dossier>;
}

const DossierContext = createContext<DossierContextType>({
  dossiers: [],
  loading: true,
  createDossier: async () => ({} as Dossier),
  updateDossier: async () => ({} as Dossier),
  transferDossier: async () => ({} as Dossier),
  getDossier: () => undefined,
  getDossiersByStatus: () => [],
  addDocument: async () => ({} as Dossier),
  setEligibility: async () => ({} as Dossier),
  setHomeDetails: async () => ({} as Dossier),
});

export const useDossiers = () => useContext(DossierContext);

// Generate a sample dossier for demo purposes
const generateMockDossier = (id: string, status: DossierStatus, name: string): Dossier => {
  const now = new Date();
  const createdAt = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date in the last 30 days

  const heatingTypes = ['electric', 'gas', 'oil', 'wood'] as const;
  const randomHeatingType = heatingTypes[Math.floor(Math.random() * heatingTypes.length)];

  return {
    id,
    status,
    createdAt,
    updatedAt: now,
    clientName: name,
    clientAddress: `${Math.floor(Math.random() * 100)} Rue de la Rénovation, 75000 Paris`,
    clientPhone: `0${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
    clientEmail: `${name.toLowerCase().replace(/\s/g, '.')}@example.com`,
    homeDetails: {
      type: Math.random() > 0.7 ? 'apartment' : 'house',
      size: Math.floor(Math.random() * 150) + 50,
      constructionYear: Math.floor(Math.random() * 70) + 1950,
      heatingType: randomHeatingType,
      currentConsumption: Math.floor(Math.random() * 15000) + 5000,
      isOwner: Math.random() > 0.2,
    },
    documents: [],
    notes: [`Dossier créé le ${createdAt.toLocaleDateString('fr-FR')}`],
  };
};

// Generate mock data
const MOCK_DOSSIERS: Dossier[] = [
  generateMockDossier("1", "qualification", "Jean Dupont"),
  generateMockDossier("2", "confirmation", "Marie Martin"),
  generateMockDossier("3", "administrative", "Philippe Petit"),
  generateMockDossier("4", "technical_visit", "Sophie Dubois"),
  generateMockDossier("5", "installation", "Pierre Leroy"),
  generateMockDossier("6", "billing", "Isabelle Bernard"),
  generateMockDossier("7", "qualification", "Antoine Moreau"),
  generateMockDossier("8", "qualification", "Claire Rousseau"),
  generateMockDossier("9", "confirmation", "Thomas Girard"),
  generateMockDossier("10", "administrative", "Camille Fournier"),
];

// In-memory storage for dossiers (for demo purposes)
let inMemoryDossiers = [...MOCK_DOSSIERS];

export function DossierProvider({ children }: { children: React.ReactNode }) {
  const [dossiers, setDossiers] = useState<Dossier[]>(inMemoryDossiers);
  const [loading, setLoading] = useState(false);

  const createDossier = async (dossier: Partial<Dossier>): Promise<Dossier> => {
    const now = new Date();
    const newDossier: Dossier = {
      id: String(dossiers.length + 1),
      status: "qualification",
      createdAt: now,
      updatedAt: now,
      clientName: "",
      clientAddress: "",
      clientPhone: "",
      clientEmail: "",
      homeDetails: {
        type: "house",
        size: 0,
        heatingType: "electric",
        isOwner: false,
      },
      documents: [],
      notes: [],
      ...dossier,
    };

    const updatedDossiers = [...dossiers, newDossier];
    setDossiers(updatedDossiers);
    inMemoryDossiers = updatedDossiers; // Update in-memory storage
    return newDossier;
  };

  const updateDossier = async (id: string, updates: Partial<Dossier>): Promise<Dossier> => {
    const index = dossiers.findIndex((d) => d.id === id);
    if (index === -1) throw new Error(`Dossier with id ${id} not found`);

    const updatedDossier = {
      ...dossiers[index],
      ...updates,
      updatedAt: new Date(),
    };

    const newDossiers = [...dossiers];
    newDossiers[index] = updatedDossier;
    setDossiers(newDossiers);
    inMemoryDossiers = newDossiers; // Update in-memory storage

    return updatedDossier;
  };

  const transferDossier = async (id: string, newStatus: DossierStatus): Promise<Dossier> => {
    const now = new Date();
    const dossier = getDossier(id);
    if (!dossier) throw new Error(`Dossier with id ${id} not found`);

    // Add the status date based on the new status
    const statusDateUpdates: Partial<Dossier> = {};

    switch (newStatus) {
      case "confirmation":
        statusDateUpdates.submissionDate = now;
        break;
      case "administrative":
        statusDateUpdates.confirmationDate = now;
        break;
      case "technical_visit":
        // No specific date for technical visit scheduling
        break;
      case "installation":
        statusDateUpdates.technicalVisitDate = now;
        break;
      case "billing":
        statusDateUpdates.installationDate = now;
        break;
      default:
        break;
    }

    // Add note about the transfer
    const notes = [
      ...dossier.notes,
      `Dossier transféré de ${dossier.status} à ${newStatus} le ${now.toLocaleDateString('fr-FR')}`,
    ];

    return updateDossier(id, {
      status: newStatus,
      ...statusDateUpdates,
      notes,
    });
  };

  const getDossier = (id: string): Dossier | undefined => {
    return dossiers.find((d) => d.id === id);
  };

  const getDossiersByStatus = (status: DossierStatus): Dossier[] => {
    return dossiers.filter((d) => d.status === status);
  };

  const addDocument = async (dossierId: string, document: Document): Promise<Dossier> => {
    const dossier = getDossier(dossierId);
    if (!dossier) throw new Error(`Dossier with id ${dossierId} not found`);

    const updatedDossier = await updateDossier(dossierId, {
      documents: [...dossier.documents, document],
      notes: [
        ...dossier.notes,
        `Document "${document.name}" ajouté le ${document.uploadDate.toLocaleDateString('fr-FR')}`,
      ],
    });

    return updatedDossier;
  };

  const setEligibility = async (dossierId: string, eligibility: ClientEligibility): Promise<Dossier> => {
    const dossier = getDossier(dossierId);
    if (!dossier) throw new Error(`Dossier with id ${dossierId} not found`);

    const updatedDossier = await updateDossier(dossierId, {
      eligibility,
      notes: [
        ...dossier.notes,
        `Éligibilité vérifiée: ${eligibility.incomeCategory} (${eligibility.subsidyRate}%) le ${new Date().toLocaleDateString('fr-FR')}`,
      ],
    });

    return updatedDossier;
  };

  const setHomeDetails = async (dossierId: string, details: HomeDetails): Promise<Dossier> => {
    const dossier = getDossier(dossierId);
    if (!dossier) throw new Error(`Dossier with id ${dossierId} not found`);

    const updatedDossier = await updateDossier(dossierId, {
      homeDetails: details,
      notes: [
        ...dossier.notes,
        `Détails du logement mis à jour le ${new Date().toLocaleDateString('fr-FR')}`,
      ],
    });

    return updatedDossier;
  };

  return (
    <DossierContext.Provider
      value={{
        dossiers,
        loading,
        createDossier,
        updateDossier,
        transferDossier,
        getDossier,
        getDossiersByStatus,
        addDocument,
        setEligibility,
        setHomeDetails,
      }}
    >
      {children}
    </DossierContext.Provider>
  );
}
