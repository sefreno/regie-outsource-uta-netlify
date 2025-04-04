"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CircleCheck, CircleDashed, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowStatusCardProps {
  title: string;
  count: number;
  description: string;
  color: "blue" | "indigo" | "purple" | "rose" | "orange" | "green" | "gray";
}

export function WorkflowStatusCard({ title, count, description, color }: WorkflowStatusCardProps) {
  // Map des couleurs pour différents états de workflow
  const colorStyles: Record<string, { bg: string, border: string, text: string }> = {
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-500" },
    indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-500" },
    purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-500" },
    rose: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-500" },
    orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-500" },
    green: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-500" },
    gray: { bg: "bg-gray-500/10", border: "border-gray-500/30", text: "text-gray-500" }
  };

  const styles = colorStyles[color] || colorStyles.gray;

  return (
    <Card className={cn("border", styles.border)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className={cn("font-medium flex items-center", styles.text)}>
            {color === "green" ? (
              <CircleCheck className="h-4 w-4 mr-1.5" />
            ) : (
              <CircleDashed className="h-4 w-4 mr-1.5" />
            )}
            {title}
          </h3>
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-end gap-2">
          <div className={cn("text-2xl font-bold", styles.text)}>{count}</div>
          <div className="text-xs text-gray-400 pb-1">dossiers</div>
        </div>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{description}</p>
      </CardContent>
    </Card>
  );
}
