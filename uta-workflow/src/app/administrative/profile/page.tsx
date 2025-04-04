"use client";

import React from "react";
import { ServiceProfile } from "@/components/dashboard/service-profile";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

// Données fictives pour le profil du service de Gestion administrative
const userProfile = {
  name: "Alexandre Blanc",
  email: "alexandre.blanc@uta-workflow.fr",
  phone: "06 34 56 78 90",
  role: "Agent administratif",
  joinDate: "12/01/2023",
};

const performanceStats = {
  dossiersCount: 85,
  completedCount: 70,
  pendingCount: 10,
  rejectedCount: 5,
  averageProcessingTime: "4.2j",
};

export default function AdministrativeProfilePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <ServiceProfile
            serviceName="Gestion administrative"
            serviceRoute="/administrative/dashboard"
            userProfile={userProfile}
            performanceStats={performanceStats}
          />
        </main>
      </div>
    </div>
  );
}
