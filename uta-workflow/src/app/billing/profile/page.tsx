"use client";

import React from "react";
import { ServiceProfile } from "@/components/dashboard/service-profile";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

// Données fictives pour le profil du service de Facturation
const userProfile = {
  name: "Sarah Martin",
  email: "sarah.martin@uta-workflow.fr",
  phone: "06 67 89 01 23",
  role: "Comptable",
  joinDate: "10/02/2023",
};

const performanceStats = {
  dossiersCount: 28,
  completedCount: 22,
  pendingCount: 5,
  rejectedCount: 1,
  averageProcessingTime: "2.8j",
};

export default function BillingProfilePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <ServiceProfile
            serviceName="Facturation"
            serviceRoute="/billing/dashboard"
            userProfile={userProfile}
            performanceStats={performanceStats}
          />
        </main>
      </div>
    </div>
  );
}
