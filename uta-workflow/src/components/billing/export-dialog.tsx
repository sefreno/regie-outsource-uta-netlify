"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BillingExportService } from "@/lib/billing/export-service";
import type { MonthlyInvoice, GovernmentInvoice, Collaborator } from "@/lib/billing/models";
import { FileDown, FileText, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Service d'export
const exportService = new BillingExportService();

// Options de format d'export
const exportFormats = [
  { id: "xlsx", name: "Excel (XLSX)", icon: <FileSpreadsheet className="h-4 w-4 mr-2" /> },
  { id: "csv", name: "CSV", icon: <FileText className="h-4 w-4 mr-2" /> },
];

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoices?: MonthlyInvoice[];
  governmentInvoices?: GovernmentInvoice[];
  collaborators?: Collaborator[];
  currentMonth?: number;
  currentYear?: number;
}

export function ExportDialog({
  open,
  onOpenChange,
  invoices = [],
  governmentInvoices = [],
  collaborators = [],
  currentMonth = new Date().getMonth() + 1,
  currentYear = new Date().getFullYear(),
}: ExportDialogProps) {
  // États du formulaire
  const [exportType, setExportType] = useState<string>("monthly"); // monthly, government, collaborator, full
  const [exportFormat, setExportFormat] = useState<string>("xlsx");
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedCollaborator, setSelectedCollaborator] = useState<string>("");
  const [includeActivities, setIncludeActivities] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [customFilename, setCustomFilename] = useState<string>("");

  // Générer un nom de fichier par défaut
  const getDefaultFilename = (): string => {
    const datePart = format(new Date(selectedYear, selectedMonth - 1), "yyyy-MM", { locale: fr });

    switch (exportType) {
      case "monthly":
        return `factures-mensuelles-${datePart}`;
      case "government":
        return `factures-gouvernementales-${datePart}`;
      case "collaborator":
        const collaborator = collaborators.find(c => c.id === selectedCollaborator);
        return collaborator
          ? `activites-${collaborator.name.toLowerCase().replace(/\s+/g, '-')}-${datePart}`
          : `activites-collaborateur-${datePart}`;
      case "full":
        return `comptabilite-complete-${datePart}`;
      default:
        return `export-facturation-${datePart}`;
    }
  };

  // Gérer l'exportation
  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Filtrer les données pour le mois et l'année sélectionnés
      const filteredInvoices = invoices.filter(
        invoice => invoice.month === selectedMonth && invoice.year === selectedYear
      );

      // Déterminer le nom de fichier final
      const filename = customFilename || getDefaultFilename();
      const finalFilename = `${filename}.${exportFormat}`;

      // Exporter selon le type sélectionné
      switch (exportType) {
        case "monthly":
          if (exportFormat === "xlsx") {
            exportService.exportMonthlyInvoicesToExcel(filteredInvoices, finalFilename);
          } else {
            exportService.exportMonthlyInvoicesToCSV(filteredInvoices, finalFilename);
          }
          break;

        case "government":
          // Pour les factures gouvernementales, nous utilisons seulement Excel
          exportService.exportGovernmentInvoicesToExcel(
            governmentInvoices,
            finalFilename
          );
          break;

        case "collaborator":
          if (selectedCollaborator) {
            // Trouver le collaborateur
            const collaborator = collaborators.find(c => c.id === selectedCollaborator);

            if (collaborator) {
              // Récupérer les activités pour ce collaborateur
              const collaboratorActivities = filteredInvoices
                .flatMap(invoice => invoice.activities)
                .filter(activity => activity.collaboratorId === selectedCollaborator);

              // Exporter les activités
              exportService.exportCollaboratorActivitiesToCSV(
                collaboratorActivities,
                collaborator,
                finalFilename
              );
            }
          }
          break;

        case "full":
          // Exporter toutes les données comptables (toujours en Excel)
          exportService.exportFullAccountingData(
            invoices,
            governmentInvoices,
            { month: selectedMonth, year: selectedYear },
            finalFilename
          );
          break;
      }

      // Fermer le dialogue après l'exportation
      setTimeout(() => {
        setIsExporting(false);
        onOpenChange(false);
      }, 1000);

    } catch (error) {
      console.error("Erreur lors de l'exportation:", error);
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exporter les données de facturation</DialogTitle>
          <DialogDescription>
            Sélectionnez le type de données à exporter et le format de fichier.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Type d'exportation */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="export-type" className="text-right">
              Type
            </Label>
            <div className="col-span-3">
              <Select
                value={exportType}
                onValueChange={setExportType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type d'export" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Factures mensuelles</SelectItem>
                  <SelectItem value="government">Factures gouvernementales</SelectItem>
                  <SelectItem value="collaborator">Activités par collaborateur</SelectItem>
                  <SelectItem value="full">Comptabilité complète</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Format d'exportation */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="export-format" className="text-right">
              Format
            </Label>
            <div className="col-span-3">
              <Select
                value={exportFormat}
                onValueChange={setExportFormat}
                disabled={exportType === "government" || exportType === "full"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un format" />
                </SelectTrigger>
                <SelectContent>
                  {exportFormats.map((format) => (
                    <SelectItem key={format.id} value={format.id}>
                      <div className="flex items-center">
                        {format.icon}
                        {format.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(exportType === "government" || exportType === "full") && (
                <p className="text-xs text-muted-foreground mt-1">
                  Ce type d'export est disponible uniquement en format Excel.
                </p>
              )}
            </div>
          </div>

          {/* Période */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Période</Label>
            <div className="col-span-3 grid grid-cols-2 gap-2">
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Mois" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {format(new Date(2000, month - 1), "MMMM", { locale: fr })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Année" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sélection de collaborateur (pour le type "collaborator") */}
          {exportType === "collaborator" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="collaborator" className="text-right">
                Collaborateur
              </Label>
              <div className="col-span-3">
                <Select
                  value={selectedCollaborator}
                  onValueChange={setSelectedCollaborator}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un collaborateur" />
                  </SelectTrigger>
                  <SelectContent>
                    {collaborators.map((collaborator) => (
                      <SelectItem key={collaborator.id} value={collaborator.id}>
                        {collaborator.name} - {collaborator.service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Inclure les activités détaillées */}
          {(exportType === "monthly" || exportType === "full") && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div></div>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="activities"
                  checked={includeActivities}
                  onCheckedChange={(checked) => setIncludeActivities(checked as boolean)}
                />
                <Label htmlFor="activities">
                  Inclure les activités détaillées
                </Label>
              </div>
            </div>
          )}

          {/* Nom de fichier personnalisé */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filename" className="text-right">
              Nom fichier
            </Label>
            <div className="col-span-3">
              <Input
                id="filename"
                placeholder={getDefaultFilename()}
                value={customFilename}
                onChange={(e) => setCustomFilename(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {exportFormat === "xlsx" ? ".xlsx" : ".csv"} sera ajouté automatiquement
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            variant="outline"
            disabled={isExporting}
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleExport}
            disabled={
              isExporting ||
              (exportType === "collaborator" && !selectedCollaborator)
            }
            className="button-highlight"
          >
            {isExporting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exportation...
              </span>
            ) : (
              <span className="flex items-center">
                <FileDown className="h-4 w-4 mr-2" />
                Exporter
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
