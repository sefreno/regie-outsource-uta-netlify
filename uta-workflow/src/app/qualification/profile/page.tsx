"use client";

import React from "react";
import { ServiceProfile } from "@/components/dashboard/service-profile";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

// Données fictives pour le profil du service de Qualification
const userProfile = {
  name: "Julien Moreau",
  email: "julien.moreau@uta-workflow.fr",
  phone: "06 12 34 56 78",
  role: "Agent de qualification",
  joinDate: "15/01/2023",
};

const performanceStats = {
  dossiersCount: 127,
  completedCount: 112,
  pendingCount: 8,
  rejectedCount: 7,
  averageProcessingTime: "2.4j",
};

export default function QualificationProfilePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <ServiceProfile
            serviceName="Qualification"
            serviceRoute="/qualification/dashboard"
            userProfile={userProfile}
            performanceStats={performanceStats}
          />
        </main>
      </div>
    </div>
  );
}
