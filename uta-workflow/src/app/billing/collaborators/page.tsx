"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { CollaboratorPerformanceCard } from "@/components/billing/collaborator-performance-card";
import { PerformanceDashboardHeader } from "@/components/billing/performance-dashboard-header";
import { PerformanceComparisonChart } from "@/components/billing/performance-comparison-chart";
import { ServicePerformanceChart } from "@/components/billing/service-performance-chart";
import { type Collaborator, type BillableActivity, ServiceType } from "@/lib/billing/models";
import { ExportDialog } from "@/components/billing/export-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Pagination } from "@/components/ui/pagination";

// Données de démonstration pour les collaborateurs
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
  },
  {
    id: "col_006",
    name: "Julie Moreau",
    email: "julie.moreau@example.com",
    service: ServiceType.TECHNICAL_VISIT,
    rate: 60,
    active: true
  },
  {
    id: "col_007",
    name: "Michel Laurent",
    email: "michel.laurent@example.com",
    service: ServiceType.INSTALLATION,
    rate: 105,
    active: true
  },
  {
    id: "col_008",
    name: "Emma Petit",
    email: "emma.petit@example.com",
    service: ServiceType.QUALIFICATION,
    rate: 32,
    active: true
  },
  {
    id: "col_009",
    name: "Lucas Rousseau",
    email: "lucas.rousseau@example.com",
    service: ServiceType.BILLING,
    rate: 90,
    active: true
  },
  {
    id: "col_010",
    name: "Clara Fontaine",
    email: "clara.fontaine@example.com",
    service: ServiceType.ADMINISTRATIVE,
    rate: 40,
    active: false
  }
];

// Données de performance par service
const mockServicePerformance = [
  {
    service: ServiceType.TECHNICAL_VISIT,
    amount: 6600,
    count: 120,
    collaboratorsCount: 2
  },
  {
    service: ServiceType.INSTALLATION,
    amount: 11000,
    count: 110,
    collaboratorsCount: 2
  },
  {
    service: ServiceType.QUALIFICATION,
    amount: 3750,
    count: 150,
    collaboratorsCount: 2
  },
  {
    service: ServiceType.CONFIRMATION,
    amount: 4500,
    count: 60,
    collaboratorsCount: 1
  },
  {
    service: ServiceType.ADMINISTRATIVE,
    amount: 2650,
    count: 53,
    collaboratorsCount: 2
  },
  {
    service: ServiceType.BILLING,
    amount: 5000,
    count: 1,
    collaboratorsCount: 1
  }
];

// Génération de données de performance pour chaque collaborateur
function generatePerformanceData(collaborator: Collaborator) {
  // Déterminer un montant en fonction du type de service
  const baseAmount = {
    [ServiceType.TECHNICAL_VISIT]: 3000,
    [ServiceType.INSTALLATION]: 5500,
    [ServiceType.QUALIFICATION]: 1500,
    [ServiceType.CONFIRMATION]: 4500,
    [ServiceType.ADMINISTRATIVE]: 1300,
    [ServiceType.BILLING]: 5000
  }[collaborator.service] || 2000;

  // Ajouter une variation aléatoire
  const randomFactor = 0.8 + Math.random() * 0.4; // Entre 0.8 et 1.2
  const currentMonthAmount = Math.round(baseAmount * randomFactor);

  // Calculer le montant du mois précédent avec une autre variation
  const previousTrend = Math.random() > 0.7 ? -0.1 : 0.1; // 30% de chance d'une baisse
  const previousFactor = 0.9 + Math.random() * 0.2 + previousTrend;
  const previousMonthAmount = Math.round(currentMonthAmount * previousFactor);

  // Calculer le nombre d'activités en fonction du montant et du taux horaire
  const activitiesCount = Math.round(currentMonthAmount / collaborator.rate);

  // Créer des activités fictives
  const activities: BillableActivity[] = Array.from({ length: Math.min(activitiesCount, 10) }, (_, i) => ({
    id: `act_${collaborator.id}_${i+1}`,
    collaboratorId: collaborator.id,
    serviceType: collaborator.service,
    date: new Date(2025, 3, i+1),
    amount: collaborator.rate,
    status: "pending",
    reference: `${collaborator.service.substring(0, 4).toUpperCase()}_${i+1}`,
    details: `Activité ${i+1} de ${collaborator.name}`
  }));

  // Données d'évolution sur 6 mois
  const monthlyBreakdown = Array.from({ length: 6 }, (_, i) => {
    const factor = 0.8 + Math.random() * 0.4;
    const month = new Date();
    month.setMonth(month.getMonth() - 5 + i);

    return {
      month: month.toLocaleString('fr-FR', { month: 'short' }),
      amount: Math.round(baseAmount * factor)
    };
  });

  // Jour le plus productif
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const mostProfitableDay = days[Math.floor(Math.random() * days.length)];

  return {
    currentMonthAmount,
    previousMonthAmount,
    activitiesCount,
    completionRate: Math.round(70 + Math.random() * 30), // Entre 70% et 100%
    avgAmountPerActivity: collaborator.rate,
    mostProfitableDay,
    recentActivities: activities,
    monthlyBreakdown
  };
}

// Générer des données pour la comparaison des performances
function generateComparisonData(collaborators: Collaborator[]) {
  return collaborators.map(collaborator => {
    const performanceData = generatePerformanceData(collaborator);
    return {
      name: collaborator.name,
      id: collaborator.id,
      service: collaborator.service,
      currentAmount: performanceData.currentMonthAmount,
      previousAmount: performanceData.previousMonthAmount,
      difference: performanceData.currentMonthAmount - performanceData.previousMonthAmount,
      activitiesCount: performanceData.activitiesCount
    };
  });
}

export default function CollaboratorPerformancePage() {
  // États pour les filtres et la pagination
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("amount_desc");
  const [showExportDialog, setShowExportDialog] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 8;

  // État pour les données de performance
  const [collaboratorsData, setCollaboratorsData] = useState<Collaborator[]>([]);
  const { toast } = useToast();

  // Charger les données au chargement de la page et quand les filtres changent
  useEffect(() => {
    // Simuler un chargement de données
    // Dans une application réelle, nous ferions un appel API ici
    setCollaboratorsData(mockCollaborators);
  }, [currentMonth, currentYear, selectedService]);

  // Filtrer les collaborateurs en fonction des critères
  const filteredCollaborators = collaboratorsData
    .filter(collaborator =>
      (!selectedService || collaborator.service === selectedService) &&
      (searchQuery === "" ||
        collaborator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collaborator.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  // Trier les collaborateurs
  const sortedCollaborators = [...filteredCollaborators].sort((a, b) => {
    // Générer les données de performance pour la comparaison
    const perfA = generatePerformanceData(a);
    const perfB = generatePerformanceData(b);

    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "amount_desc":
        return perfB.currentMonthAmount - perfA.currentMonthAmount;
      case "amount_asc":
        return perfA.currentMonthAmount - perfB.currentMonthAmount;
      case "activities":
        return perfB.activitiesCount - perfA.activitiesCount;
      case "trend":
        const trendA = perfA.previousMonthAmount > 0
          ? (perfA.currentMonthAmount - perfA.previousMonthAmount) / perfA.previousMonthAmount
          : 0;
        const trendB = perfB.previousMonthAmount > 0
          ? (perfB.currentMonthAmount - perfB.previousMonthAmount) / perfB.previousMonthAmount
          : 0;
        return trendB - trendA;
      default:
        return 0;
    }
  });

  // Paginer les collaborateurs
  const paginatedCollaborators = sortedCollaborators.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Préparer les données de comparaison pour le graphique
  const comparisonData = generateComparisonData(
    sortedCollaborators.slice(0, 10) // Limiter à 10 pour le graphique
  );

  // Calculer le résumé des performances
  const performanceSummary = {
    totalAmount: sortedCollaborators.reduce((sum, collaborator) =>
      sum + generatePerformanceData(collaborator).currentMonthAmount, 0),
    activeCollaborators: sortedCollaborators.filter(c => c.active).length,
    averageAmount: sortedCollaborators.length > 0
      ? Math.round(sortedCollaborators.reduce((sum, collaborator) =>
          sum + generatePerformanceData(collaborator).currentMonthAmount, 0) / sortedCollaborators.length)
      : 0,
    topPerformer: sortedCollaborators.length > 0
      ? {
          name: sortedCollaborators[0].name,
          amount: generatePerformanceData(sortedCollaborators[0]).currentMonthAmount
        }
      : { name: "N/A", amount: 0 }
  };

  // Gérer les actions d'exportation
  const handleExport = () => {
    setShowExportDialog(true);
  };

  // Gérer l'impression du rapport
  const handlePrintReport = () => {
    toast({
      title: "Impression du rapport",
      description: "Préparation du rapport PDF pour impression...",
    });
    // Dans une application réelle, nous générerions un PDF ici
  };

  // Gérer la vue détaillée d'un collaborateur
  const handleViewDetails = (collaboratorId: string) => {
    toast({
      title: "Affichage des détails",
      description: `Chargement des détails pour ${collaboratorId}...`,
    });
    // Dans une application réelle, nous naviguerions vers une page de détails
  };

  // Gérer l'exportation des données d'un collaborateur
  const handleExportData = (collaboratorId: string) => {
    toast({
      title: "Exportation des données",
      description: `Préparation de l'export pour ${collaboratorId}...`,
    });
    // Dans une application réelle, nous exporterions les données ici
  };

  // Gérer l'envoi d'un rapport à un collaborateur
  const handleSendReport = (collaboratorId: string) => {
    toast({
      title: "Envoi du rapport",
      description: `Préparation du rapport pour ${collaboratorId}...`,
    });
    // Dans une application réelle, nous enverrions un email ici
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          {/* Header avec filtres et résumé */}
          <PerformanceDashboardHeader
            summary={performanceSummary}
            currentMonth={currentMonth}
            currentYear={currentYear}
            selectedService={selectedService}
            searchQuery={searchQuery}
            sortBy={sortBy}
            onUpdateMonth={setCurrentMonth}
            onUpdateYear={setCurrentYear}
            onUpdateService={setSelectedService}
            onSearch={setSearchQuery}
            onSort={setSortBy}
            onExport={handleExport}
            onPrintReport={handlePrintReport}
          />

          <div className="mt-8 space-y-8">
            {/* Graphiques de performance */}
            <div className="grid gap-6 md:grid-cols-3">
              <PerformanceComparisonChart
                collaboratorData={comparisonData}
                period={{ month: currentMonth, year: currentYear }}
              />
              <ServicePerformanceChart
                serviceData={mockServicePerformance}
                period={{ month: currentMonth, year: currentYear }}
              />
            </div>

            {/* Cartes de performance des collaborateurs */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Performance individuelle
                {selectedService && ` - ${selectedService}`}
                {searchQuery && ` - Recherche: "${searchQuery}"`}
              </h2>

              {paginatedCollaborators.length === 0 ? (
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center">
                  <p className="text-gray-400">Aucun collaborateur ne correspond à vos critères de recherche.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {paginatedCollaborators.map((collaborator) => (
                    <CollaboratorPerformanceCard
                      key={collaborator.id}
                      collaborator={collaborator}
                      performanceData={generatePerformanceData(collaborator)}
                      onViewDetails={handleViewDetails}
                      onExportData={handleExportData}
                      onSendReport={handleSendReport}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {filteredCollaborators.length > itemsPerPage && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    currentPage={page}
                    totalPages={Math.ceil(filteredCollaborators.length / itemsPerPage)}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal d'exportation */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        // Normalement, ces propriétés seraient remplies avec des données réelles
        collaborators={mockCollaborators}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />
    </div>
  );
}
