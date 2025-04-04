"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkflowStatusCard } from "@/components/management/workflow-status-card";
import { WorkflowMetricsChart } from "@/components/management/workflow-metrics-chart";
import { DocumentationOverview } from "@/components/management/documentation-overview";
import { ServiceIntegrationStatus } from "@/components/management/service-integration-status";
import { AlertsList } from "@/components/management/alerts-list";
import { WorkflowProgressChart } from "@/components/management/workflow-progress-chart";
import { PlusCircle, BarChart, AlertTriangle, ClipboardList, RefreshCw } from "lucide-react";

export default function ManagementDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Données fictives pour le résumé des dossiers
  const filesSummary = {
    total: 342,
    byStatus: {
      reception: 48,
      verification: 32,
      enrichment: 94,
      submission: 71,
      monitoring: 64,
      closure: 33
    },
    alerts: 18,
    pendingDocuments: 27,
    apiSubmissionSuccess: 93.4,
    deadlinesRespected: 87.2
  };

  // Données fictives pour les services
  const servicesStatus = {
    confirmation: { status: "operational", pending: 12 },
    administrative: { status: "operational", pending: 8 },
    technicalVisit: { status: "issue", pending: 15 },
    installation: { status: "operational", pending: 22 },
    billing: { status: "operational", pending: 5 }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Gestion du Workflow</h1>
              <p className="text-gray-400">
                Centre de contrôle pour la gestion des dossiers clients
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Nouveau dossier
              </Button>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>

          {/* Résumé global des dossiers */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{filesSummary.total}</div>
                <p className="text-gray-400">Dossiers au total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-yellow-500">{filesSummary.alerts}</div>
                <p className="text-gray-400">Alertes actives</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-500">{filesSummary.pendingDocuments}</div>
                <p className="text-gray-400">Documents en attente</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-500">{filesSummary.deadlinesRespected}%</div>
                <p className="text-gray-400">Respect des délais</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs pour différentes sections */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
              <TabsTrigger value="services">Intégration Services</TabsTrigger>
              <TabsTrigger value="alerts">Alertes & Notifications</TabsTrigger>
            </TabsList>

            {/* Tab: Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Statuts des workflows */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ClipboardList className="h-5 w-5 mr-2" />
                      Statut des Workflows
                    </CardTitle>
                    <CardDescription>
                      Vue d'ensemble des dossiers clients par étape de workflow
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      <WorkflowStatusCard
                        title="Réception"
                        count={filesSummary.byStatus.reception}
                        description="Récupération des dossiers qualifiés"
                        color="blue"
                      />
                      <WorkflowStatusCard
                        title="Vérification"
                        count={filesSummary.byStatus.verification}
                        description="Contrôle des champs obligatoires"
                        color="indigo"
                      />
                      <WorkflowStatusCard
                        title="Enrichissement"
                        count={filesSummary.byStatus.enrichment}
                        description="Ajout données techniques"
                        color="purple"
                      />
                      <WorkflowStatusCard
                        title="Soumission"
                        count={filesSummary.byStatus.submission}
                        description="Transmission aux instances"
                        color="rose"
                      />
                      <WorkflowStatusCard
                        title="Suivi"
                        count={filesSummary.byStatus.monitoring}
                        description="Mise à jour statut d'octroi"
                        color="orange"
                      />
                      <WorkflowStatusCard
                        title="Clôture"
                        count={filesSummary.byStatus.closure}
                        description="Archivage après paiement"
                        color="green"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Graphique de progression du workflow */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart className="h-5 w-5 mr-2" />
                      Progression Workflow
                    </CardTitle>
                    <CardDescription>
                      Taux d'achèvement par étape du processus
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <WorkflowProgressChart />
                    </div>
                  </CardContent>
                </Card>

                {/* Indicateurs de performance du workflow */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart className="h-5 w-5 mr-2" />
                      Métriques Workflow
                    </CardTitle>
                    <CardDescription>
                      Indicateurs clés de performance du processus
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <WorkflowMetricsChart />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab: Documentation */}
            <TabsContent value="documentation">
              <Card>
                <CardHeader>
                  <CardTitle>Centralisation Documentaire</CardTitle>
                  <CardDescription>
                    Gestion des pièces justificatives et documents officiels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentationOverview />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Intégration Services */}
            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>Statut d'Intégration des Services</CardTitle>
                  <CardDescription>
                    Communication entre les différents services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ServiceIntegrationStatus servicesStatus={servicesStatus} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Alertes */}
            <TabsContent value="alerts">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                    Alertes et Notifications
                  </CardTitle>
                  <CardDescription>
                    Suivi des alertes nécessitant une attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertsList />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
