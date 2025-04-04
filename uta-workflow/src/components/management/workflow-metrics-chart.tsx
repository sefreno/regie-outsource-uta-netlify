"use client";

import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function WorkflowMetricsChart() {
  const [activeMetric, setActiveMetric] = useState<string>("delay");

  // Données fictives pour les métriques du workflow
  const metricData = {
    delay: [
      { name: "Sem 1", value: 2.1 },
      { name: "Sem 2", value: 1.8 },
      { name: "Sem 3", value: 2.3 },
      { name: "Sem 4", value: 1.5 },
      { name: "Sem 5", value: 1.2 },
      { name: "Sem 6", value: 0.9 },
    ],
    success: [
      { name: "API Anah", value: 94 },
      { name: "API MPR", value: 89 },
      { name: "Téléchargements", value: 96 },
      { name: "Signatures", value: 92 },
    ],
    deadlines: [
      { name: "Sous 24h", value: 62 },
      { name: "24-48h", value: 25 },
      { name: "48-72h", value: 8 },
      { name: "+72h", value: 5 }
    ]
  };

  // Couleurs pour les graphiques
  const colors = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#a855f7"];

  // Formatage des tooltips
  const formatTooltip = (value: number, name: string, metric: string) => {
    if (metric === "delay") {
      return [`${value} jours`, "Délai moyen"];
    } else if (metric === "success") {
      return [`${value}%`, name];
    } else {
      return [`${value}%`, name];
    }
  };

  // Rendu du graphique en fonction de la métrique sélectionnée
  const renderChart = () => {
    if (activeMetric === "delay") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={metricData.delay}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
            <XAxis dataKey="name" tick={{ fill: "#888" }} axisLine={{ stroke: "#444" }} />
            <YAxis
              tickFormatter={(value) => `${value}j`}
              tick={{ fill: "#888" }}
              axisLine={{ stroke: "#444" }}
            />
            <Tooltip
              formatter={(value: number) => formatTooltip(value, "", "delay")}
              contentStyle={{
                backgroundColor: "#1f2937",
                borderColor: "#374151",
                color: "#e5e7eb"
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (activeMetric === "success") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={metricData.success}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
              label={({ name, value }) => `${name}: ${value}%`}
              labelLine={true}
            >
              {metricData.success.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => formatTooltip(value, name, "success")}
              contentStyle={{
                backgroundColor: "#1f2937",
                borderColor: "#374151",
                color: "#e5e7eb"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={metricData.deadlines}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
              label={({ name, value }) => `${name}: ${value}%`}
              labelLine={true}
            >
              {metricData.deadlines.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => formatTooltip(value, name, "deadlines")}
              contentStyle={{
                backgroundColor: "#1f2937",
                borderColor: "#374151",
                color: "#e5e7eb"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeMetric} onValueChange={setActiveMetric} className="mb-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="delay">Délais</TabsTrigger>
          <TabsTrigger value="success">Taux de réussite</TabsTrigger>
          <TabsTrigger value="deadlines">Respect des délais</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex-1">
        {renderChart()}
      </div>
    </div>
  );
}
