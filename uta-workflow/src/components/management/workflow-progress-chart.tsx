"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export function WorkflowProgressChart() {
  // Données fictives pour le graphique de progression du workflow
  const progressData = [
    { name: "Réception", completion: 92, issues: 4 },
    { name: "Vérification", completion: 85, issues: 8 },
    { name: "Enrichissement", completion: 78, issues: 12 },
    { name: "Soumission", completion: 70, issues: 15 },
    { name: "Suivi", completion: 65, issues: 10 },
    { name: "Clôture", completion: 60, issues: 7 },
  ];

  // Couleurs pour les barres
  const barColors = {
    completion: "#3b82f6", // blue-500
    issues: "#ef4444", // red-500
  };

  // Formater les tooltips
  const formatTooltip = (value: number, name: string) => {
    const formattedName = name === "completion" ? "Taux de complétion" : "Problèmes rencontrés";
    return [`${value}%`, formattedName];
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={progressData}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
        <XAxis
          dataKey="name"
          tick={{ fill: "#888" }}
          axisLine={{ stroke: "#444" }}
        />
        <YAxis
          tickFormatter={(value) => `${value}%`}
          domain={[0, 100]}
          tick={{ fill: "#888" }}
          axisLine={{ stroke: "#444" }}
        />
        <Tooltip
          formatter={formatTooltip}
          contentStyle={{
            backgroundColor: "#1f2937",
            borderColor: "#374151",
            color: "#e5e7eb"
          }}
        />
        <Bar
          dataKey="completion"
          name="Complétion"
          fill={barColors.completion}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="issues"
          name="Problèmes"
          fill={barColors.issues}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
