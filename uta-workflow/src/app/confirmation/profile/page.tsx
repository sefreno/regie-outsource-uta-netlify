"use client";

import React from "react";
import { ServiceProfile } from "@/components/dashboard/service-profile";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

// Données fictives pour le profil du service de Confirmation
const userProfile = {
  name: "Emma Martin",
  email: "emma.martin@uta-workflow.fr",
  phone: "06 23 45 67 89",
  role: "Agent de confirmation",
  joinDate: "03/02/2023",
};

const performanceStats = {
  dossiersCount: 98,
  completedCount: 82,
  pendingCount: 12,
  rejectedCount: 4,
  averageProcessingTime: "3.1j",
};

export default function ConfirmationProfilePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <ServiceProfile
            serviceName="Confirmation"
            serviceRoute="/confirmation/dashboard"
            userProfile={userProfile}
            performanceStats={performanceStats}
          />
        </main>
      </div>
    </div>
  );
}
