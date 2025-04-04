"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { formatCurrency } from "@/lib/utils";
import { Collaborator, ServiceType } from "@/lib/billing/models";

interface CollaboratorPerformanceComparisonData {
  name: string;
  id: string;
  service: ServiceType;
  currentAmount: number;
  previousAmount: number;
  difference: number;
  activitiesCount: number;
}

interface PerformanceComparisonChartProps {
  collaboratorData: CollaboratorPerformanceComparisonData[];
  period: {
    month: number;
    year: number;
  };
  title?: string;
  description?: string;
}

// Obtenir une couleur pour le graphique selon le type de service
const getServiceColor = (service: ServiceType): string => {
  const colors: Record<ServiceType, string> = {
    [ServiceType.TECHNICAL_VISIT]: '#3b82f6',  // blue
    [ServiceType.INSTALLATION]: '#22c55e',     // green
    [ServiceType.QUALIFICATION]: '#eab308',    // yellow
    [ServiceType.CONFIRMATION]: '#a855f7',     // purple
    [ServiceType.ADMINISTRATIVE]: '#6b7280',   // gray
    [ServiceType.BILLING]: '#ef4444',          // red
  };
  return colors[service] || '#6b7280';
};

export function PerformanceComparisonChart({
  collaboratorData,
  period,
  title = "Comparaison des performances",
  description = "Montants générés par collaborateur pour la période",
}: PerformanceComparisonChartProps) {
  // Formater les données pour le graphique
  const chartData = collaboratorData.map(collaborator => ({
    name: collaborator.name,
    id: collaborator.id,
    service: collaborator.service,
    montant: collaborator.currentAmount,
    "mois précédent": collaborator.previousAmount,
    différence: collaborator.difference,
    color: getServiceColor(collaborator.service),
  }));

  // Déterminer les libellés du mois courant et du mois précédent
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const currentMonthName = months[period.month - 1];
  let previousMonthIndex = period.month - 2;
  let previousYear = period.year;

  if (previousMonthIndex < 0) {
    previousMonthIndex = 11; // Décembre
    previousYear = period.year - 1;
  }

  const previousMonthName = months[previousMonthIndex];

  // Formatter personnalisé pour le tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-gray-800 p-3 rounded-md shadow-md">
          <p className="font-bold">{data.name}</p>
          <p className="text-sm text-gray-400">{data.service}</p>
          <div className="mt-2">
            <p className="text-sm">
              <span className="text-gray-400">{currentMonthName}:</span>{" "}
              <span className="font-medium">{formatCurrency(data.montant)}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-400">{previousMonthName}:</span>{" "}
              <span className="font-medium">{formatCurrency(data["mois précédent"])}</span>
            </p>
            <p className="text-sm mt-1">
              <span className="text-gray-400">Différence:</span>{" "}
              <span className={`font-medium ${data.différence >= 0 ? "text-green-500" : "text-red-500"}`}>
                {formatCurrency(data.différence)}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 20,
              right: 30,
              left: 40,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={value => formatCurrency(value)} />
            <YAxis
              dataKey="name"
              type="category"
              scale="band"
              tick={{ fontSize: 12 }}
              width={100}
              tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="montant"
              name={currentMonthName}
              fill={(entry) => entry.color}
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
            <Bar
              dataKey="mois précédent"
              name={previousMonthName}
              fill={(entry) => `${entry.color}80`} // Ajouter une transparence
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
