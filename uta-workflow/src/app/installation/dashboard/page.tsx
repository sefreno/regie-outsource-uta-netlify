"use client";

import React from "react";
import { ServiceDashboard } from "@/components/dashboard/service-dashboard";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, CheckCircle, Clock, FileText, PlusCircle } from "lucide-react";

// Données fictives pour le tableau de bord d'Installation
const installationStats = {
  total: 12,
  completed: 7,
  pending: 4,
  rejected: 1,
};

const recentDossiers = [
  {
    id: "INST001",
    client: "Jean Dupont",
    address: "123 Rue de la Paix, 75001 Paris",
    date: "15/05/2023",
    status: "pending" as const,
    installationType: "Pompe à chaleur air/eau",
  },
  {
    id: "INST002",
    client: "Marie Lambert",
    address: "45 Avenue des Fleurs, 69002 Lyon",
    date: "18/05/2023",
    status: "scheduled" as const,
    installationType: "Isolation des combles",
  },
  {
    id: "INST003",
    client: "Sophie Dubois",
    address: "12 Rue du Faubourg, 31000 Toulouse",
    date: "10/05/2023",
    status: "completed" as const,
    installationType: "Remplacement fenêtres",
  },
  {
    id: "INST004",
    client: "Thomas Bernard",
    address: "3 Place de la République, 44000 Nantes",
    date: "20/05/2023",
    status: "pending" as const,
    installationType: "Isolation murs extérieurs",
  },
];

const userStats = [
  {
    name: "Mathieu Richard",
    processedCount: 5,
    completedCount: 4,
  },
  {
    name: "Laura Dubois",
    processedCount: 4,
    completedCount: 3,
  },
  {
    name: "Pierre Lefebvre",
    processedCount: 3,
    completedCount: 0,
  },
];

// Installations à venir
const upcomingInstallations = [
  {
    id: "INST001",
    client: "Jean Dupont",
    address: "123 Rue de la Paix, 75001 Paris",
    date: "15/05/2023",
    installationType: "Pompe à chaleur air/eau",
  },
  {
    id: "INST004",
    client: "Thomas Bernard",
    address: "3 Place de la République, 44000 Nantes",
    date: "20/05/2023",
    installationType: "Isolation murs extérieurs",
  },
  {
    id: "INST002",
    client: "Marie Lambert",
    address: "45 Avenue des Fleurs, 69002 Lyon",
    date: "18/05/2023",
    installationType: "Isolation des combles",
  },
];

export default function InstallationDashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold tracking-tight">Tableau de bord Installation</h1>
              <Button className="button-highlight" asChild>
                <Link href="/installation/installation-form?id=INST001">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nouveau formulaire d'installation
                </Link>
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total des installations</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{installationStats.total}</div>
                  <p className="text-xs text-muted-foreground">
                    Installations enregistrées
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Installations terminées</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{installationStats.completed}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((installationStats.completed / installationStats.total) * 100)}% du total
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En attente</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{installationStats.pending}</div>
                  <p className="text-xs text-muted-foreground">
                    À traiter
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rejetées</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{installationStats.rejected}</div>
                  <p className="text-xs text-muted-foreground">
                    Non réalisables
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Installations récentes</CardTitle>
                  <CardDescription>
                    Liste des derniers dossiers d'installation traités
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentDossiers.map((dossier) => (
                      <div
                        key={dossier.id}
                        className="flex items-center justify-between p-4 border border-gray-800 rounded-lg"
                      >
                        <div className="space-y-1">
                          <h3 className="font-medium">{dossier.client}</h3>
                          <p className="text-sm text-gray-400">{dossier.address}</p>
                          <p className="text-xs text-gray-500">{dossier.installationType}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              dossier.status === "completed"
                                ? "bg-green-900/20 text-green-500 border border-green-900/20"
                                : dossier.status === "rejected"
                                ? "bg-red-900/20 text-red-500 border border-red-900/20"
                                : dossier.status === "scheduled"
                                ? "bg-blue-900/20 text-blue-500 border border-blue-900/20"
                                : "bg-yellow-900/20 text-yellow-500 border border-yellow-900/20"
                            }`}
                          >
                            {dossier.status === "completed"
                              ? "Terminé"
                              : dossier.status === "rejected"
                              ? "Rejeté"
                              : dossier.status === "scheduled"
                              ? "Planifié"
                              : "En attente"}
                          </span>
                          <Button size="sm" className="button-highlight" asChild>
                            <Link href={`/installation/installation-form?id=${dossier.id}`}>
                              Voir détails
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Installations à venir</CardTitle>
                  <CardDescription>
                    Prochaines installations programmées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingInstallations.map((installation) => (
                      <div
                        key={installation.id}
                        className="flex items-center p-3 border border-gray-800 rounded-lg"
                      >
                        <Calendar className="h-5 w-5 mr-3 text-primary" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">
                            {installation.client} - {installation.installationType}
                          </p>
                          <p className="text-xs text-gray-400">
                            {installation.date} - {installation.address}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" className="ml-2" asChild>
                          <Link href={`/installation/installation-form?id=${installation.id}`}>
                            Formulaire
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <ServiceDashboard
              serviceName="Installation"
              serviceRoute="/installation"
              stats={installationStats}
              recentDossiers={recentDossiers}
              userStats={userStats}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
