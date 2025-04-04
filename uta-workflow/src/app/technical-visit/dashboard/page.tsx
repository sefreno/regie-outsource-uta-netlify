"use client";

import React from "react";
import { ServiceDashboard } from "@/components/dashboard/service-dashboard";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, ClipboardCheck, CalendarDays } from "lucide-react"; // Added CalendarDays import
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"; // Assuming these imports exist

// Données fictives pour le tableau de bord de Visite technique
const technicalVisitStats = {
  total: 15,
  completed: 8,
  pending: 6,
  rejected: 1,
};

const recentDossiers = [
  {
    id: "TV001",
    client: "Jean Dupont",
    address: "123 Rue de la Paix, 75001 Paris",
    date: "25/04/2023",
    status: "pending" as const,
  },
  {
    id: "TV002",
    client: "Marie Lambert",
    address: "45 Avenue des Fleurs, 69002 Lyon",
    date: "26/04/2023",
    status: "pending" as const,
  },
  {
    id: "TV003",
    client: "Sophie Dubois",
    address: "12 Rue du Faubourg, 31000 Toulouse",
    date: "24/04/2023",
    status: "completed" as const,
  },
  {
    id: "TV004",
    client: "Thomas Bernard",
    address: "3 Place de la République, 44000 Nantes",
    date: "27/04/2023",
    status: "pending" as const,
  },
];

const userStats = [
  {
    name: "Nicolas Durand",
    processedCount: 7,
    completedCount: 5,
  },
  {
    name: "Élodie Petit",
    processedCount: 6,
    completedCount: 3,
  },
  {
    name: "Romain Simon",
    processedCount: 2,
    completedCount: 0,
  },
];

export default function TechnicalVisitDashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Visite technique - Tableau de bord</h1>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="button-highlight flex items-center"
                asChild
              >
                <Link href="/technical-visit/appointments">
                  <Calendar className="h-4 w-4 mr-2" />
                  Voir les rendez-vous
                </Link>
              </Button>
              <Button
                variant="outline"
                className="button-highlight flex items-center"
                asChild
              >
                <Link href="/technical-visit/calendar">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Calendrier
                </Link>
              </Button>
              <Button
                variant="default"
                className="button-highlight flex items-center"
                asChild
              >
                <Link href="/technical-visit/profile">
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Rapports techniques
                </Link>
              </Button>
            </div>
          </div>
          <ServiceDashboard
            serviceName="Visite technique"
            serviceRoute="/technical-visit"
            stats={technicalVisitStats}
            recentDossiers={recentDossiers}
            userStats={userStats}
          />
          <div className="mt-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Calendrier des prochains rendez-vous</CardTitle>
                  <CardDescription>Aperçu des visites techniques planifiées</CardDescription>
                </div>
                <Button variant="outline" className="button-highlight" asChild>
                  <Link href="/technical-visit/calendar">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Calendrier complet
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center p-10 border border-dashed border-gray-700 rounded-lg">
                  <CalendarDays className="h-10 w-10 mx-auto mb-4 text-gray-500" />
                  <p className="text-lg font-medium">Consultez le calendrier interactif</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Visualisez et gérez tous les rendez-vous de visite technique
                  </p>
                  <Button className="mt-4 button-highlight" asChild>
                    <Link href="/technical-visit/calendar">
                      Ouvrir le calendrier
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
