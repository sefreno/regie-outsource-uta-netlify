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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Sector,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { ServiceType } from "@/lib/billing/models";

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

// Traduction des types de service
const translateServiceType = (service: ServiceType): string => {
  const translations: Record<ServiceType, string> = {
    [ServiceType.TECHNICAL_VISIT]: 'Visite technique',
    [ServiceType.INSTALLATION]: 'Installation',
    [ServiceType.QUALIFICATION]: 'Qualification',
    [ServiceType.CONFIRMATION]: 'Confirmation',
    [ServiceType.ADMINISTRATIVE]: 'Administrative',
    [ServiceType.BILLING]: 'Facturation',
  };
  return translations[service] || service;
};

interface ServicePerformanceData {
  service: ServiceType;
  amount: number;
  count: number;
  collaboratorsCount: number;
}

interface ServicePerformanceChartProps {
  serviceData: ServicePerformanceData[];
  period: {
    month: number;
    year: number;
  };
  title?: string;
  description?: string;
}

export function ServicePerformanceChart({
  serviceData,
  period,
  title = "Répartition par service",
  description = "Montants générés par type de service",
}: ServicePerformanceChartProps) {
  // État pour l'élément sélectionné dans le graphique
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(undefined);

  // Formatter les données pour le graphique
  const chartData = serviceData.map(service => ({
    name: translateServiceType(service.service),
    value: service.amount,
    count: service.count,
    collaborators: service.collaboratorsCount,
    color: getServiceColor(service.service),
  }));

  // Déterminer le mois et l'année pour le titre
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  const monthName = months[period.month - 1];

  // Gérer la sélection d'un segment dans le graphique
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  // Composant pour rendre un segment actif
  const renderActiveShape = (props: any) => {
    const {
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value
    } = props;

    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#FFF" className="text-sm font-bold">
          {payload.name}
        </text>
        <text x={cx} y={cy} textAnchor="middle" fill="#FFF" className="text-xl font-bold">
          {formatCurrency(value)}
        </text>
        <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#FFF" className="text-xs">
          {(percent * 100).toFixed(1)}% du total
        </text>
        <text x={cx} y={cy} dy={40} textAnchor="middle" fill="#FFF" className="text-xs">
          {payload.count} activités
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.3}
        />
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  // Formatter personnalisé pour le tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-gray-800 p-3 rounded-md shadow-md">
          <p className="font-bold">{payload[0].name}</p>
          <div className="mt-2">
            <p className="text-sm">
              <span className="text-gray-400">Montant:</span>{" "}
              <span className="font-medium">{formatCurrency(payload[0].value)}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-400">Activités:</span>{" "}
              <span className="font-medium">{payload[0].payload.count}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-400">Collaborateurs:</span>{" "}
              <span className="font-medium">{payload[0].payload.collaborators}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description} - {monthName} {period.year}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
