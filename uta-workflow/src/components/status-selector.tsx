"use client";

import React from "react";
import { Button } from "@/components/ui/button"; // Corrected import path if necessary
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type QualificationStatus = 'validated' | 'rejected' | 'no_response' | 'callback';

const STATUS_DATA = {
  validated: {
    label: "Validé",
    color: "bg-green-700 hover:bg-green-600 text-white",
    icon: CheckCircle,
    description: "Le client est éligible et le dossier est transmis au service administratif"
  },
  rejected: {
    label: "Annulé",
    color: "bg-red-700 hover:bg-red-600 text-white",
    icon: XCircle,
    description: "Le dossier est rejeté et ne sera pas traité"
  },
  no_response: {
    label: "Ne répond pas",
    color: "bg-orange-700 hover:bg-orange-600 text-white",
    icon: AlertCircle,
    description: "Le client ne répond pas aux tentatives de contact"
  },
  callback: {
    label: "À rappeler",
    color: "bg-blue-700 hover:bg-blue-600 text-white",
    icon: Clock,
    description: "Le client doit être recontacté plus tard"
  }
};

interface StatusSelectorProps {
  value?: QualificationStatus;
  onChange?: (value: QualificationStatus) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  showDescription?: boolean;
  disabled?: boolean;
}

export function StatusSelector({
  value,
  onChange,
  className,
  size = "md",
  showDescription = false,
  disabled = false
}: StatusSelectorProps) {
  const handleStatusChange = (status: QualificationStatus) => {
    if (disabled) return;
    onChange?.(status);
  };

  const getButtonSize = () => {
    switch (size) {
      case "sm": return "text-xs px-2 py-1";
      case "lg": return "text-base px-4 py-2";
      default: return "text-sm px-3 py-1.5";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Object.entries(STATUS_DATA).map(([statusKey, statusData]) => {
          const status = statusKey as QualificationStatus;
          const Icon = statusData.icon;
          const isSelected = value === status;

          return (
            <Button
              key={statusKey}
              type="button"
              className={cn(
                getButtonSize(),
                statusData.color,
                isSelected && "ring-2 ring-white",
                disabled && "opacity-60 cursor-not-allowed",
                "transition-all flex items-center justify-center space-x-1"
              )}
              onClick={() => handleStatusChange(status)}
              disabled={disabled}
            >
              <Icon className="h-4 w-4 mr-1" />
              <span>{statusData.label}</span>
            </Button>
          );
        })}
      </div>

      {showDescription && value && (
        <div className="text-sm p-3 bg-gray-800 rounded-md">
          <p>{STATUS_DATA[value].description}</p>
        </div>
      )}
    </div>
  );
}
