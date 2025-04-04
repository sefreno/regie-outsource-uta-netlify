"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CollaboratorPerformanceDetail } from "@/components/billing/collaborator-performance-detail";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { type Collaborator, type BillableActivity, ServiceType } from "@/lib/billing/models";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCcw } from "lucide-react";

// Fonction de simulation pour obtenir les données d'un collaborateur
function getCollaboratorData(id: string): Collaborator | null {
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

  return mockCollaborators.find(c => c.id === id) || null;
}

// Fonction de simulation pour générer des statistiques de performance
function generatePerformanceStats(collaborator: Collaborator) {
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
  const currentMonthActivities = Math.round(currentMonthAmount / collaborator.rate);
  const previousMonthActivities = Math.round(previousMonthAmount / collaborator.rate);

  // Générer des données d'évolution sur 12 mois
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const factor = 0.7 + Math.random() * 0.6; // Entre 0.7 et 1.3
    const month = new Date();
    month.setMonth(month.getMonth() - 11 + i);

    return {
      month: month.toLocaleString('fr-FR', { month: 'short', year: 'numeric' }),
      amount: Math.round(baseAmount * factor),
      activitiesCount: Math.round((baseAmount * factor) / collaborator.rate)
    };
  });

  // Calculer le total de l'année
  const totalYearToDate = monthlyData.reduce((sum, data) => sum + data.amount, 0);
  const averageMonthlyAmount = Math.round(totalYearToDate / monthlyData.length);

  // Créer des activités fictives
  const activities: BillableActivity[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Déterminer un statut aléatoire
    const statuses = ['pending', 'completed', 'cancelled', 'inProgress'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      id: `act_${collaborator.id}_${i+1}`,
      collaboratorId: collaborator.id,
      serviceType: collaborator.service,
      date,
      amount: collaborator.rate,
      status: randomStatus,
      reference: `${collaborator.service.substring(0, 4).toUpperCase()}_${date.getFullYear()}_${(i+1).toString().padStart(3, '0')}`,
      details: `Activité #${i+1} de ${collaborator.name} - ${randomStatus}`
    };
  });

  // Jour et horaire les plus productifs
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const times = ['Matin (9h-12h)', 'Après-midi (14h-17h)', 'Soirée (17h-19h)'];

  return {
    currentMonthAmount,
    previousMonthAmount,
    averageMonthlyAmount,
    totalYearToDate,
    currentMonthActivities,
    previousMonthActivities,
    completionRate: Math.round(70 + Math.random() * 30), // Entre 70% et 100%
    successRate: Math.round(80 + Math.random() * 20), // Entre 80% et 100%
    averageAmountPerActivity: collaborator.rate,
    mostProfitableDay: days[Math.floor(Math.random() * days.length)],
    mostProfitableTime: times[Math.floor(Math.random() * times.length)],
    performanceTrend: ((currentMonthAmount - previousMonthAmount) / previousMonthAmount) * 100,
    activities,
    monthlyData
  };
}

export default function CollaboratorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const collaboratorId = params.id as string;

  const [collaborator, setCollaborator] = useState<Collaborator | null>(null);
  const [performanceStats, setPerformanceStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Charger les données du collaborateur
  useEffect(() => {
    setIsLoading(true);

    // Simuler un chargement de données
    setTimeout(() => {
      const data = getCollaboratorData(collaboratorId);
      setCollaborator(data);

      if (data) {
        const stats = generatePerformanceStats(data);
        setPerformanceStats(stats);
      }

      setIsLoading(false);
    }, 500);
  }, [collaboratorId]);

  // Gérer l'exportation
  const handleExport = (format: "csv" | "excel" | "pdf") => {
    toast({
      title: `Exportation au format ${format.toUpperCase()}`,
      description: `Préparation de l'export des données de ${collaborator?.name} en ${format.toUpperCase()}...`,
    });
    // Dans une application réelle, nous exporterions ici les données
  };

  // Gérer l'envoi du rapport
  const handleSendReport = () => {
    toast({
      title: "Envoi du rapport",
      description: `Préparation du rapport mensuel pour ${collaborator?.name}...`,
    });
    // Dans une application réelle, nous enverrions un email ici
  };

  // Gérer le rafraîchissement des données
  const handleRefresh = () => {
    if (collaborator) {
      const stats = generatePerformanceStats(collaborator);
      setPerformanceStats(stats);

      toast({
        title: "Données actualisées",
        description: "Les données de performance ont été mises à jour.",
      });
    }
  };

  // Si les données sont en cours de chargement
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-400">Chargement des données...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Si le collaborateur n'existe pas
  if (!collaborator || !performanceStats) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-bold mb-4">Collaborateur non trouvé</h2>
              <p className="text-gray-400 mb-6">Le collaborateur demandé n'existe pas ou a été supprimé.</p>
              <Button
                onClick={() => router.push('/billing/collaborators')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la liste
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => router.push('/billing/collaborators')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux collaborateurs
            </Button>
            <Button
              variant="ghost"
              onClick={handleRefresh}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Actualiser les données
            </Button>
          </div>

          <CollaboratorPerformanceDetail
            collaborator={collaborator}
            stats={performanceStats}
            onExport={handleExport}
            onSendReport={handleSendReport}
            onRefresh={handleRefresh}
          />
        </main>
      </div>
    </div>
  );
}
