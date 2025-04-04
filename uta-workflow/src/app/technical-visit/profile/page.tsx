"use client";

import React from "react";
import { ServiceProfile } from "@/components/dashboard/service-profile";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

// Données fictives pour le profil du service de Visite technique
const userProfile = {
  name: "Nicolas Durand",
  email: "nicolas.durand@uta-workflow.fr",
  phone: "06 45 67 89 01",
  role: "Technicien",
  joinDate: "05/03/2023",
};

const performanceStats = {
  dossiersCount: 42,
  completedCount: 29,
  pendingCount: 10,
  rejectedCount: 3,
  averageProcessingTime: "5.7j",
};

export default function TechnicalVisitProfilePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <ServiceProfile
            serviceName="Visite technique"
            serviceRoute="/technical-visit/dashboard"
            userProfile={userProfile}
            performanceStats={performanceStats}
          />
        </main>
      </div>
    </div>
  );
}
