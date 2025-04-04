"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceType, GovernmentFundingType, type Collaborator, type BillableActivity, type MonthlyInvoice, type GovernmentInvoice } from "@/lib/billing/models";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  BadgeEuro,
  FileSpreadsheet,
  Users,
  TrendingUp,
  Banknote,
  Building2,
  CreditCard,
  ReceiptText,
  FileCheck,
  Clock,
} from "lucide-react";
// Importer le composant de dialogue d'exportation
import { ExportDialog } from "@/components/billing/export-dialog";

// Données de démonstration
const billingStats = {
  totalInvoiced: 28500,
  totalPaid: 18500,
  totalPending: 10000,
  monthlySummary: [
    { month: "Jan", amount: 2000, paid: 2000, pending: 0 },
    { month: "Fév", amount: 3500, paid: 3500, pending: 0 },
    { month: "Mar", amount: 4000, paid: 4000, pending: 0 },
    { month: "Avr", amount: 8000, paid: 6000, pending: 2000 },
    { month: "Mai", amount: 11000, paid: 3000, pending: 8000 },
  ],
  byService: [
    { name: "Visite Technique", amount: 6600, count: 120 },
    { name: "Installation", amount: 11000, count: 110 },
    { name: "Qualification", amount: 3750, count: 150 },
    { name: "Confirmation", amount: 4500, count: 60 },
    { name: "Administratif", amount: 2650, count: 53 },
  ],
  activeCollaborators: 12,
  pendingInvoices: 8,
};

// Données de démonstration pour les factures gouvernementales
const governmentStats = {
  totalAmount: 28000,
  paidAmount: 8000,
  pendingAmount: 20000,
  invoiceCount: 3,
  byType: [
    { type: "MaPrimeRénov", amount: 15000, count: 1 },
    { type: "CEE", amount: 8000, count: 1 },
    { type: "Eco-PTZ", amount: 5000, count: 1 },
  ],
};

// Mock des collaborateurs pour l'export
const mockCollaborators: Collaborator[] = [
  {
    id: "col_001",
    name: "Jean Martin",
    email: "jean.martin@example.com",
    service: ServiceType.TECHNICAL_VISIT,
    rate: 55,
    active: true
  },
  {
    id: "col_002",
    name: "Marie Dubois",
    email: "marie.dubois@example.com",
    service: ServiceType.INSTALLATION,
    rate: 110,
    active: true
  },
  {
    id: "col_003",
    name: "Pierre Dupont",
    email: "pierre.dupont@example.com",
    service: ServiceType.QUALIFICATION,
    rate: 30,
    active: true
  },
  {
    id: "col_004",
    name: "Sophie Bernard",
    email: "sophie.bernard@example.com",
    service: ServiceType.CONFIRMATION,
    rate: 80,
    active: true
  },
  {
    id: "col_005",
    name: "Thomas Leclerc",
    email: "thomas.leclerc@example.com",
    service: ServiceType.ADMINISTRATIVE,
    rate: 35,
    active: true
  }
];

// Mock des activités pour l'export
const mockActivities: BillableActivity[] = [
  // Activités pour Jean Martin (Visite technique)
  ...Array(12).fill(null).map((_, i) => ({
    id: `act_tv_${i+1}`,
    collaboratorId: "col_001",
    serviceType: ServiceType.TECHNICAL_VISIT,
    date: new Date(2025, 3, i+1),
    amount: 55,
    status: "pending",
    reference: `visit_${i+1}`,
    details: `Visite technique #${i+1}`
  })),

  // Activités pour Marie Dubois (Installation)
  ...Array(8).fill(null).map((_, i) => ({
    id: `act_inst_${i+1}`,
    collaboratorId: "col_002",
    serviceType: ServiceType.INSTALLATION,
    date: new Date(2025, 3, i+5),
    amount: 110,
    status: "pending",
    reference: `inst_${i+1}`,
    details: `Installation #${i+1}`
  })),
];

// Mock des factures mensuelles pour l'export
const mockInvoices: MonthlyInvoice[] = mockCollaborators.map(collaborator => {
  const collaboratorActivities = mockActivities.filter(
    activity => activity.collaboratorId === collaborator.id
  );

  return {
    id: `inv_20250401_${collaborator.id}`,
    collaboratorId: collaborator.id,
    month: 4,
    year: 2025,
    totalAmount: collaboratorActivities.reduce((sum, activity) => sum + activity.amount, 0),
    activities: collaboratorActivities,
    generatedDate: new Date(2025, 4, 5),
    status: "draft",
    invoiceNumber: `INV-202504-${collaborator.id.substring(0, 8)}`
  };
});

// Mock des factures gouvernementales pour l'export
const mockGovernmentInvoices: GovernmentInvoice[] = [
  {
    id: "gov_001",
    fundingType: GovernmentFundingType.MAPRIMERENOVS,
    dossierIds: ["dossier_001", "dossier_002", "dossier_003"],
    totalAmount: 15000,
    submissionDate: new Date(2025, 3, 15),
    expectedPaymentDate: new Date(2025, 5, 15),
    status: "submitted",
    invoiceNumber: "GOV-MAPRIMERENOVS-202504-ABC123"
  },
  {
    id: "gov_002",
    fundingType: GovernmentFundingType.CEE,
    dossierIds: ["dossier_004", "dossier_005"],
    totalAmount: 8000,
    submissionDate: new Date(2025, 3, 10),
    expectedPaymentDate: new Date(2025, 5, 10),
    paidDate: new Date(2025, 5, 8),
    status: "paid",
    invoiceNumber: "GOV-CEE-202504-DEF456",
    referenceNumber: "REF-20250508-123456"
  }
];

export default function BillingDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [billingData, setBillingData] = useState(billingStats);
  const [governmentData, setGovernmentData] = useState(governmentStats);

  // Ajouter un état pour contrôler l'ouverture/fermeture du dialogue d'exportation
  const [showExportDialog, setShowExportDialog] = useState<boolean>(false);

  useEffect(() => {
    // Dans une application réelle, nous ferions un appel API ici
    // setIsLoading(true);
    // fetch('/api/billing/statistics')
    //   .then(res => res.json())
    //   .then(data => {
    //     setBillingData(data);
    //     setIsLoading(false);
    //   })
    //   .catch(error => {
    //     console.error("Erreur lors du chargement des statistiques:", error);
    //     setIsLoading(false);
    //   });
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold tracking-tight">Facturation</h1>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowExportDialog(true)}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
                <Button className="button-highlight">
                  <BadgeEuro className="h-4 w-4 mr-2" />
                  Générer les factures
                </Button>
              </div>
            </div>

            <Tabs
              defaultValue="overview"
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList>
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="collaborators">Collaborateurs</TabsTrigger>
                <TabsTrigger value="government">Financements Étatiques</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Facturé
                      </CardTitle>
                      <BadgeEuro className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(billingData.totalInvoiced)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Sur l'ensemble des services
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Paiements Reçus
                      </CardTitle>
                      <Banknote className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(billingData.totalPaid)}
                      </div>
                      <div className="text-xs text-green-500">
                        {Math.round((billingData.totalPaid / billingData.totalInvoiced) * 100)}% du total
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        En Attente
                      </CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(billingData.totalPending)}
                      </div>
                      <div className="text-xs text-yellow-500">
                        {billingData.pendingInvoices} factures en attente
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Collaborateurs Actifs
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {billingData.activeCollaborators}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Répartis sur tous les services
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Graphiques d'aperçu */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="col-span-1">
                    <CardHeader>
                      <CardTitle>Facturation mensuelle</CardTitle>
                      <CardDescription>
                        Évolution du chiffre d'affaires par mois
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          width={500}
                          height={300}
                          data={billingData.monthlySummary}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => formatCurrency(value as number)}
                          />
                          <Legend />
                          <Bar
                            dataKey="paid"
                            name="Payé"
                            fill="#22c55e"
                            stackId="a"
                          />
                          <Bar
                            dataKey="pending"
                            name="En attente"
                            fill="#eab308"
                            stackId="a"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="col-span-1">
                    <CardHeader>
                      <CardTitle>Répartition par service</CardTitle>
                      <CardDescription>
                        Montant total facturé par type de service
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          width={500}
                          height={300}
                          data={billingData.byService}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => formatCurrency(value as number)}
                          />
                          <Legend />
                          <Bar
                            dataKey="amount"
                            name="Montant"
                            fill="#3b82f6"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="collaborators" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.values(ServiceType).map((service, index) => {
                    const serviceData = billingData.byService[index] || {
                      name: service,
                      amount: 0,
                      count: 0,
                    };

                    let icon;
                    switch (service) {
                      case ServiceType.TECHNICAL_VISIT:
                        icon = <FileCheck className="h-4 w-4 text-primary" />;
                        break;
                      case ServiceType.INSTALLATION:
                        icon = <TrendingUp className="h-4 w-4 text-primary" />;
                        break;
                      case ServiceType.QUALIFICATION:
                        icon = <FileSpreadsheet className="h-4 w-4 text-primary" />;
                        break;
                      case ServiceType.CONFIRMATION:
                        icon = <ReceiptText className="h-4 w-4 text-primary" />;
                        break;
                      case ServiceType.ADMINISTRATIVE:
                        icon = <Building2 className="h-4 w-4 text-primary" />;
                        break;
                      case ServiceType.BILLING:
                        icon = <CreditCard className="h-4 w-4 text-primary" />;
                        break;
                      default:
                        icon = <BadgeEuro className="h-4 w-4 text-primary" />;
                    }

                    return (
                      <Card key={service}>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                          <div>
                            <CardTitle className="text-base">
                              {serviceData.name}
                            </CardTitle>
                            <CardDescription>
                              {serviceData.count} activités
                            </CardDescription>
                          </div>
                          {icon}
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {formatCurrency(serviceData.amount)}
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <Button
                              variant="outline"
                              className="w-full"
                              size="sm"
                            >
                              Détails
                            </Button>
                            <Button className="w-full" size="sm">
                              Factures
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="government" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Facturé à l'État
                      </CardTitle>
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(governmentData.totalAmount)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {governmentData.invoiceCount} factures
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Déjà Payé
                      </CardTitle>
                      <Banknote className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(governmentData.paidAmount)}
                      </div>
                      <div className="text-xs text-green-500">
                        {Math.round((governmentData.paidAmount / governmentData.totalAmount) * 100)}% du total
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        En Attente
                      </CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(governmentData.pendingAmount)}
                      </div>
                      <div className="text-xs text-yellow-500">
                        {governmentData.invoiceCount - 1} factures en attente
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/10 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Nouvelle Facture
                      </CardTitle>
                      <ReceiptText className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full mt-2 bg-primary hover:bg-primary/90">
                        Créer
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Factures par type de financement</CardTitle>
                    <CardDescription>
                      Montants facturés selon les dispositifs d'aide
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {governmentData.byType.map((item) => (
                        <div key={item.type} className="flex items-center">
                          <div className="w-1/2">
                            <div className="font-medium">{item.type}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.count} facture{item.count > 1 ? "s" : ""}
                            </div>
                          </div>
                          <div className="w-1/2">
                            <div className="relative h-4 w-full overflow-hidden rounded-full bg-primary/20">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{
                                  width: `${(item.amount / governmentData.totalAmount) * 100}%`,
                                }}
                              />
                            </div>
                            <div className="mt-1 text-right text-sm font-medium">
                              {formatCurrency(item.amount)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        {/* Ajouter le dialogue d'exportation à la fin du contenu du tableau de bord */}
        <ExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          invoices={mockInvoices} // Utiliser les données réelles ou mock
          governmentInvoices={mockGovernmentInvoices} // Utiliser les données réelles ou mock
          collaborators={mockCollaborators} // Utiliser les données réelles ou mock
          currentMonth={new Date().getMonth() + 1}
          currentYear={new Date().getFullYear()}
        />
      </div>
    </div>
  );
}
