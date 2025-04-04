"use client";

import React from "react";
import { ServiceDashboard } from "@/components/dashboard/service-dashboard";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

// Données fictives pour le tableau de bord de Gestion administrative
const administrativeStats = {
  total: 18,
  completed: 12,
  pending: 5,
  rejected: 1,
};

const recentDossiers = [
  {
    id: "A10034",
    client: "Thomas Bernard",
    address: "3 Place de la République, 44000 Nantes",
    date: "17/04/2023",
    status: "completed" as const,
  },
  {
    id: "A10035",
    client: "Marie Lambert",
    address: "45 Avenue des Fleurs, 69002 Lyon",
    date: "16/04/2023",
    status: "pending" as const,
  },
  {
    id: "A10036",
    client: "Jean Dupont",
    address: "123 Rue de la Paix, 75001 Paris",
    date: "16/04/2023",
    status: "pending" as const,
  },
  {
    id: "A10037",
    client: "Sophie Dubois",
    address: "12 Rue du Faubourg, 31000 Toulouse",
    date: "15/04/2023",
    status: "callback" as const,
  },
  {
    id: "A10038",
    client: "Paul Martin",
    address: "8 Boulevard Haussman, 75008 Paris",
    date: "15/04/2023",
    status: "rejected" as const,
  },
];

const userStats = [
  {
    name: "Alexandre Blanc",
    processedCount: 9,
    completedCount: 7,
  },
  {
    name: "Céline Robert",
    processedCount: 5,
    completedCount: 3,
  },
  {
    name: "David Legrand",
    processedCount: 4,
    completedCount: 2,
  },
];

export default function AdministrativeDashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <ServiceDashboard
            serviceName="Gestion administrative"
            serviceRoute="/administrative"
            stats={administrativeStats}
            recentDossiers={recentDossiers}
            userStats={userStats}
          />
        </main>
      </div>
    </div>
  );
}
