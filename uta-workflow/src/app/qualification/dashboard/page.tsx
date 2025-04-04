"use client";

import React from "react";
import { ServiceDashboard } from "@/components/dashboard/service-dashboard";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

// Données fictives pour le tableau de bord de Qualification
const qualificationStats = {
  total: 25,
  completed: 18,
  pending: 5,
  rejected: 2,
};

const recentDossiers = [
  {
    id: "Q12567",
    client: "Jean Dupont",
    address: "123 Rue de la Paix, 75001 Paris",
    date: "15/04/2023",
    status: "completed" as const,
  },
  {
    id: "Q12568",
    client: "Marie Lambert",
    address: "45 Avenue des Fleurs, 69002 Lyon",
    date: "14/04/2023",
    status: "pending" as const,
  },
  {
    id: "Q12569",
    client: "Paul Martin",
    address: "8 Boulevard Haussman, 75008 Paris",
    date: "14/04/2023",
    status: "rejected" as const,
  },
  {
    id: "Q12570",
    client: "Sophie Dubois",
    address: "12 Rue du Faubourg, 31000 Toulouse",
    date: "13/04/2023",
    status: "callback" as const,
  },
  {
    id: "Q12571",
    client: "Thomas Bernard",
    address: "3 Place de la République, 44000 Nantes",
    date: "12/04/2023",
    status: "completed" as const,
  },
];

const userStats = [
  {
    name: "Julien Moreau",
    processedCount: 12,
    completedCount: 10,
  },
  {
    name: "Amélie Petit",
    processedCount: 8,
    completedCount: 7,
  },
  {
    name: "Lucas Girard",
    processedCount: 5,
    completedCount: 3,
  },
];

export default function QualificationDashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <ServiceDashboard
            serviceName="Qualification"
            serviceRoute="/qualification"
            stats={qualificationStats}
            recentDossiers={recentDossiers}
            userStats={userStats}
          />
        </main>
      </div>
    </div>
  );
}
