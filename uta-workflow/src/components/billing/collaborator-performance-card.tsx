"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { type Collaborator, type BillableActivity, ServiceType } from "@/lib/billing/models";
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, File, MailIcon, Printer } from "lucide-react";

// Obtenir une couleur selon le type de service
const getServiceColor = (service: ServiceType): string => {
  const colors: Record<ServiceType, string> = {
    [ServiceType.TECHNICAL_VISIT]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    [ServiceType.INSTALLATION]: 'bg-green-500/10 text-green-500 border-green-500/20',
    [ServiceType.QUALIFICATION]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    [ServiceType.CONFIRMATION]: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    [ServiceType.ADMINISTRATIVE]: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    [ServiceType.BILLING]: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  return colors[service] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};

// Obtenir une icône pour représenter la tendance
const getTrendIcon = (percentage: number) => {
  if (percentage > 0) {
    return <ArrowUpRight className="h-4 w-4 text-green-500" />;
  } else if (percentage < 0) {
    return <ArrowDownRight className="h-4 w-4 text-red-500" />;
  } else {
    return <Minus className="h-4 w-4 text-gray-500" />;
  }
};

interface CollaboratorPerformanceData {
  currentMonthAmount: number;
  previousMonthAmount: number;
  activitiesCount: number;
  completionRate: number;
  avgAmountPerActivity: number;
  mostProfitableDay?: string;
  recentActivities: BillableActivity[];
  monthlyBreakdown: {
    month: string;
    amount: number;
  }[];
}

interface CollaboratorPerformanceCardProps {
  collaborator: Collaborator;
  performanceData: CollaboratorPerformanceData;
  onViewDetails: (collaboratorId: string) => void;
  onExportData: (collaboratorId: string) => void;
  onSendReport: (collaboratorId: string) => void;
}

export function CollaboratorPerformanceCard({
  collaborator,
  performanceData,
  onViewDetails,
  onExportData,
  onSendReport,
}: CollaboratorPerformanceCardProps) {
  // Calculer les tendances par rapport au mois précédent
  const trend = performanceData.previousMonthAmount > 0
    ? ((performanceData.currentMonthAmount - performanceData.previousMonthAmount) / performanceData.previousMonthAmount) * 100
    : 0;

  const trendFormatted = trend > 0
    ? `+${trend.toFixed(1)}%`
    : trend < 0
    ? `${trend.toFixed(1)}%`
    : "0%";

  const trendClass = trend > 0
    ? "text-green-500"
    : trend < 0
    ? "text-red-500"
    : "text-gray-500";

  return (
    <Card className="overflow-hidden border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{collaborator.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Badge variant="outline" className={`mr-2 ${getServiceColor(collaborator.service)}`}>
                {collaborator.service}
              </Badge>
              {collaborator.active ? (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Actif
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                  Inactif
                </Badge>
              )}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {formatCurrency(performanceData.currentMonthAmount)}
            </div>
            <div className={`flex items-center justify-end text-sm ${trendClass}`}>
              {getTrendIcon(trend)}
              <span className="ml-1">{trendFormatted} vs mois précédent</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="space-y-4">
          {/* Progression par rapport à l'objectif */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Taux de complétion</span>
              <span className="font-medium">{performanceData.completionRate}%</span>
            </div>
            <Progress value={performanceData.completionRate} className="h-2" />
          </div>

          {/* Statistiques clés */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-gray-400">Activités ce mois</p>
              <p className="font-medium">{performanceData.activitiesCount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-400">Montant moyen</p>
              <p className="font-medium">{formatCurrency(performanceData.avgAmountPerActivity)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-400">Activité principale</p>
              <p className="font-medium">{collaborator.service}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-400">Jour le plus productif</p>
              <p className="font-medium">{performanceData.mostProfitableDay || "N/A"}</p>
            </div>
          </div>

          {/* Graphique d'évolution mensuelle */}
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Évolution mensuelle</h4>
            <div className="flex items-end space-x-1 h-24">
              {performanceData.monthlyBreakdown.map((data, index) => {
                // Calculer la hauteur de la barre (entre 10% et 100%)
                const maxValue = Math.max(...performanceData.monthlyBreakdown.map(d => d.amount));
                const heightPercent = maxValue > 0
                  ? 10 + (data.amount / maxValue * 90)
                  : 10;

                const isCurrentMonth = index === performanceData.monthlyBreakdown.length - 1;

                return (
                  <div key={data.month} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-full rounded-t-sm ${isCurrentMonth ? 'bg-primary' : 'bg-gray-700'}`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <div className="text-xs text-gray-500 mt-1">{data.month}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activités récentes */}
          {performanceData.recentActivities.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Activités récentes</h4>
              <div className="space-y-1">
                {performanceData.recentActivities.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex justify-between items-center p-2 text-sm border border-gray-800 rounded-md">
                    <div className="flex items-center">
                      <File className="h-3 w-3 mr-2 text-gray-400" />
                      <span className="text-gray-200">{activity.reference}</span>
                    </div>
                    <div className="font-medium">{formatCurrency(activity.amount)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <Separator className="mb-3" />

      <CardFooter className="pt-0 gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onViewDetails(collaborator.id)}>
          <TrendingUp className="h-4 w-4 mr-2" />
          Détails
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onExportData(collaborator.id)}>
          <Printer className="h-4 w-4 mr-2" />
          Exporter
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onSendReport(collaborator.id)}>
          <MailIcon className="h-4 w-4 mr-2" />
          Rapport
        </Button>
      </CardFooter>
    </Card>
  );
}
