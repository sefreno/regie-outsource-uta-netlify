"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import {
  BarChart3,
  FileText,
  FileCheck,
  Clipboard,
  Wrench,
  Truck,
  Banknote,
  ArrowRight
} from "lucide-react";

// Mock data pour le tableau de bord
const statusCounts = {
  qualification: 3,
  confirmation: 2,
  administrative: 2,
  technical_visit: 1,
  installation: 1,
  billing: 1,
};

const statusLabels: Record<string, string> = {
  qualification: "Qualification",
  confirmation: "Confirmation",
  administrative: "Gestion administrative",
  technical_visit: "Visite technique",
  installation: "Installation",
  billing: "Facturation",
};

const statusIcons: Record<string, React.ReactNode> = {
  qualification: <FileText className="h-5 w-5 text-blue-500" />,
  confirmation: <FileCheck className="h-5 w-5 text-green-500" />,
  administrative: <Clipboard className="h-5 w-5 text-yellow-500" />,
  technical_visit: <Wrench className="h-5 w-5 text-orange-500" />,
  installation: <Truck className="h-5 w-5 text-purple-500" />,
  billing: <Banknote className="h-5 w-5 text-red-500" />,
};

const statusRoutes: Record<string, string> = {
  qualification: "/qualification/dashboard",
  confirmation: "/confirmation/dashboard",
  administrative: "/administrative/dashboard",
  technical_visit: "/technical-visit/dashboard",
  installation: "/installation/dashboard",
  billing: "/billing/dashboard",
};

const mockUser = {
  name: "Administrateur Demo",
  email: "admin@uta.fr",
  role: "admin"
};

export default function DashboardPage() {
  const totalDossiers = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "qualification":
        return "from-blue-500 to-blue-600";
      case "confirmation":
        return "from-green-500 to-green-600";
      case "administrative":
        return "from-yellow-500 to-yellow-600";
      case "technical_visit":
        return "from-orange-500 to-orange-600";
      case "installation":
        return "from-purple-500 to-purple-600";
      case "billing":
        return "from-red-500 to-red-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Tableau de bord général</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(statusCounts).map(([status, count]) => (
                <Card
                  key={status}
                  className="bg-gray-900 border-gray-800 hover:shadow-lg transition-shadow group relative"
                >
                  <Link
                    href={statusRoutes[status]}
                    className="absolute inset-0 z-10"
                    aria-label={`Voir le tableau de bord ${statusLabels[status]}`}
                  />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      {statusIcons[status]}
                      <span className="ml-2">{statusLabels[status]}</span>
                    </CardTitle>
                    <div className="text-2xl font-bold">{count}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Progress
                        value={totalDossiers ? (count / totalDossiers) * 100 : 0}
                        className="h-2 bg-gray-800 overflow-hidden"
                      >
                        <div className={`h-full bg-gradient-to-r ${getStatusColor(status)}`} />
                      </Progress>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-400">
                          {totalDossiers
                            ? `${Math.round((count / totalDossiers) * 100)}% des dossiers`
                            : "Aucun dossier"}
                        </p>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Progression du workflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(statusCounts).map(([status, count], index) => (
                      <div key={status} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getStatusColor(status)}`} />
                            <span className="text-sm font-medium">
                              {statusLabels[status]}
                            </span>
                          </div>
                          <span className="text-sm">{count}</span>
                        </div>
                        <Progress
                          value={totalDossiers ? (count / totalDossiers) * 100 : 0}
                          className="h-2 bg-gray-800 overflow-hidden"
                        >
                          <div className={`h-full bg-gradient-to-r ${getStatusColor(status)}`} />
                        </Progress>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Informations utilisateur</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-400">Nom</p>
                      <p>{mockUser.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-400">Email</p>
                      <p>{mockUser.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-400">Rôle</p>
                      <p className="capitalize">Administrateur</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-4">
                      <Button
                        variant="outline"
                        className="w-full justify-center button-highlight"
                        asChild
                      >
                        <Link href="/settings/">
                          Paramètres
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-center button-highlight"
                        asChild
                      >
                        <Link href="/login/">
                          Changer de compte
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
