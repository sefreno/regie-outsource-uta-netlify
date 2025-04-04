"use client";

import React from "react";
import { ServiceProfile } from "@/components/dashboard/service-profile";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

// Données fictives pour le profil du service d'Installation
const userProfile = {
  name: "Mathieu Richard",
  email: "mathieu.richard@uta-workflow.fr",
  phone: "06 56 78 90 12",
  role: "Installateur",
  joinDate: "20/02/2023",
};

const performanceStats = {
  dossiersCount: 36,
  completedCount: 30,
  pendingCount: 5,
  rejectedCount: 1,
  averageProcessingTime: "7.3j",
};

export default function InstallationProfilePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <ServiceProfile
            serviceName="Installation"
            serviceRoute="/installation/dashboard"
            userProfile={userProfile}
            performanceStats={performanceStats}
          />
        </main>
      </div>
    </div>
  );
}
