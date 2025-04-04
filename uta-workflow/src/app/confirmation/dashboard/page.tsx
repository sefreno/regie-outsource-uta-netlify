"use client";

import React from "react";
import { ServiceDashboard } from "@/components/dashboard/service-dashboard";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

// Données fictives pour le tableau de bord de Confirmation
const confirmationStats = {
  total: 20,
  completed: 14,
  pending: 4,
  rejected: 2,
};

const recentDossiers = [
  {
    id: "C10245",
    client: "Marie Lambert",
    address: "45 Avenue des Fleurs, 69002 Lyon",
    date: "16/04/2023",
    status: "completed" as const,
  },
  {
    id: "C10246",
    client: "Jean Dupont",
    address: "123 Rue de la Paix, 75001 Paris",
    date: "15/04/2023",
    status: "pending" as const,
  },
  {
    id: "C10247",
    client: "Thomas Bernard",
    address: "3 Place de la République, 44000 Nantes",
    date: "15/04/2023",
    status: "callback" as const,
  },
  {
    id: "C10248",
    client: "Sophie Dubois",
    address: "12 Rue du Faubourg, 31000 Toulouse",
    date: "14/04/2023",
    status: "rejected" as const,
  },
];

const userStats = [
  {
    name: "Emma Martin",
    processedCount: 10,
    completedCount: 8,
  },
  {
    name: "Antoine Leroy",
    processedCount: 6,
    completedCount: 5,
  },
  {
    name: "Camille Dubois",
    processedCount: 4,
    completedCount: 2,
  },
];

export default function ConfirmationDashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <ServiceDashboard
            serviceName="Confirmation"
            serviceRoute="/confirmation"
            stats={confirmationStats}
            recentDossiers={recentDossiers}
            userStats={userStats}
          />
        </main>
      </div>
    </div>
  );
}
