"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import { ServiceType } from "@/lib/billing/models";
import { formatCurrency, formatNumberWithSpaces } from "@/lib/utils";

// Couleurs pour les types de service (doit correspondre aux couleurs utilisées ailleurs)
const serviceColors: Record<ServiceType, string> = {
  [ServiceType.TECHNICAL_VISIT]: "#3b82f6", // blue-500
  [ServiceType.INSTALLATION]: "#22c55e", // green-500
  [ServiceType.QUALIFICATION]: "#eab308", // yellow-500
  [ServiceType.CONFIRMATION]: "#a855f7", // purple-500
  [ServiceType.ADMINISTRATIVE]: "#6b7280", // gray-500
  [ServiceType.BILLING]: "#ef4444", // red-500
};

export interface CollaboratorMonthlyData {
  id: string;
  name: string;
  service: ServiceType;
  monthlyData: {
    month: string; // Format: "2025-04" (YYYY-MM)
    displayMonth: string; // Format pour l'affichage: "Avril 2025"
    amount: number;
    activitiesCount: number;
    completionRate: number;
  }[];
}

interface MonthlyPerformanceChartProps {
  data: CollaboratorMonthlyData[];
  period: {
    startMonth: number;
    startYear: number;
    endMonth: number;
    endYear: number;
  };
}

export function MonthlyPerformanceChart({ data, period }: MonthlyPerformanceChartProps) {
  const [activeTab, setActiveTab] = useState<"amount" | "activities" | "completion">("amount");
  const [chartData, setChartData] = useState<any[]>([]);

  // Préparer les données pour le graphique
  useEffect(() => {
    const { startMonth, startYear, endMonth, endYear } = period;

    // Générer les mois entre la période de début et de fin
    const months: string[] = [];
    const currentDate = new Date(startYear, startMonth - 1);
    const endDate = new Date(endYear, endMonth - 1);

    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      months.push(`${year}-${month.toString().padStart(2, '0')}`);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Créer un objet pour chaque mois avec les données de chaque collaborateur
    const formattedData = months.map(monthKey => {
      const [year, month] = monthKey.split('-');
      const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1);

      // Formater le mois pour l'affichage
      const monthDisplay = date.toLocaleString('fr-FR', {
        month: 'long',
        year: 'numeric'
      });

      // Initialiser l'objet pour ce mois
      const monthData: any = {
        month: monthKey,
        monthDisplay: monthDisplay,
      };

      // Ajouter les données de chaque collaborateur
      data.forEach(collaborator => {
        const monthData = collaborator.monthlyData.find(m => m.month === monthKey);

        if (activeTab === "amount") {
          monthData[collaborator.id] = monthData?.amount || 0;
        } else if (activeTab === "activities") {
          monthData[collaborator.id] = monthData?.activitiesCount || 0;
        } else if (activeTab === "completion") {
          monthData[collaborator.id] = monthData?.completionRate || 0;
        }
      });

      return monthData;
    });

    setChartData(formattedData);
  }, [data, period, activeTab]);

  // Formatter pour les tooltips
  const formatYAxis = (value: number) => {
    if (activeTab === "amount") {
      return formatCurrency(value, { notation: 'compact' });
    } else if (activeTab === "activities") {
      return formatNumberWithSpaces(value);
    } else {
      return `${value}%`;
    }
  };

  const getTooltipFormatter = (value: number, name: string) => {
    // Trouver le collaborateur correspondant au nom
    const collaborator = data.find(c => c.id === name);
    const displayName = collaborator?.name || name;

    if (activeTab === "amount") {
      return [formatCurrency(value), displayName];
    } else if (activeTab === "activities") {
      return [formatNumberWithSpaces(value), displayName];
    } else {
      return [`${value}%`, displayName];
    }
  };

  // Titre du graphique en fonction de l'onglet actif
  const getChartTitle = () => {
    if (activeTab === "amount") {
      return "Évolution des montants facturés";
    } else if (activeTab === "activities") {
      return "Évolution du nombre d'activités";
    } else {
      return "Évolution du taux de complétion";
    }
  };

  return (
    <Card className="col-span-3 overflow-hidden border-gray-800">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-bold">{getChartTitle()}</CardTitle>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="amount">Montants</TabsTrigger>
            <TabsTrigger value="activities">Activités</TabsTrigger>
            <TabsTrigger value="completion">Complétion</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0 pt-6">
        <div className="h-80 w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === "completion" ? (
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                <XAxis
                  dataKey="monthDisplay"
                  tick={{ fill: "#888" }}
                  axisLine={{ stroke: "#444" }}
                />
                <YAxis
                  tickFormatter={formatYAxis}
                  tick={{ fill: "#888" }}
                  axisLine={{ stroke: "#444" }}
                  domain={[0, 100]}
                />
                <Tooltip
                  formatter={getTooltipFormatter}
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderColor: "#374151",
                    color: "#e5e7eb"
                  }}
                />
                <Legend />
                {data.map((collaborator) => (
                  <Line
                    key={collaborator.id}
                    type="monotone"
                    dataKey={collaborator.id}
                    name={collaborator.name}
                    stroke={serviceColors[collaborator.service]}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                <XAxis
                  dataKey="monthDisplay"
                  tick={{ fill: "#888" }}
                  axisLine={{ stroke: "#444" }}
                />
                <YAxis
                  tickFormatter={formatYAxis}
                  tick={{ fill: "#888" }}
                  axisLine={{ stroke: "#444" }}
                />
                <Tooltip
                  formatter={getTooltipFormatter}
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderColor: "#374151",
                    color: "#e5e7eb"
                  }}
                />
                <Legend />
                {data.map((collaborator) => (
                  <Bar
                    key={collaborator.id}
                    dataKey={collaborator.id}
                    name={collaborator.name}
                    fill={serviceColors[collaborator.service]}
                  />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
