"use client";

import React from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { ServiceType } from "@/lib/billing/models";
import { FileDown, Calendar, Search, ArrowDownAZ, Users, BadgeEuro, TrendingUp, Printer } from "lucide-react";

interface PerformanceSummary {
  totalAmount: number;
  activeCollaborators: number;
  averageAmount: number;
  topPerformer: {
    name: string;
    amount: number;
  };
}

interface PerformanceDashboardHeaderProps {
  summary: PerformanceSummary;
  currentMonth: number;
  currentYear: number;
  selectedService: string | null;
  searchQuery: string;
  sortBy: string;
  onUpdateMonth: (month: number) => void;
  onUpdateYear: (year: number) => void;
  onUpdateService: (service: string | null) => void;
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
  onExport: () => void;
  onPrintReport: () => void;
}

export function PerformanceDashboardHeader({
  summary,
  currentMonth,
  currentYear,
  selectedService,
  searchQuery,
  sortBy,
  onUpdateMonth,
  onUpdateYear,
  onUpdateService,
  onSearch,
  onSort,
  onExport,
  onPrintReport,
}: PerformanceDashboardHeaderProps) {
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Performances des collaborateurs</h1>
          <p className="text-muted-foreground">
            Suivi des activités et des performances financières individuelles
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onExport}>
            <FileDown className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" onClick={onPrintReport}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button className="button-highlight">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analyses
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex flex-row items-center p-6">
            <BadgeEuro className="h-10 w-10 p-2 mr-4 rounded-full bg-primary/10 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Montant total</p>
              <p className="text-2xl font-bold">{formatCurrency(summary.totalAmount)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-row items-center p-6">
            <Users className="h-10 w-10 p-2 mr-4 rounded-full bg-primary/10 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Collaborateurs actifs</p>
              <p className="text-2xl font-bold">{summary.activeCollaborators}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-row items-center p-6">
            <TrendingUp className="h-10 w-10 p-2 mr-4 rounded-full bg-primary/10 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Montant moyen</p>
              <p className="text-2xl font-bold">{formatCurrency(summary.averageAmount)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-row items-center p-6">
            <div className="h-10 w-10 p-2 mr-4 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              {summary.topPerformer.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm text-muted-foreground truncate">Top performer</p>
              <p className="text-md font-bold truncate">{summary.topPerformer.name}</p>
              <p className="text-sm">{formatCurrency(summary.topPerformer.amount)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select
            value={currentMonth.toString()}
            onValueChange={(value) => onUpdateMonth(Number.parseInt(value))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Mois" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={(index + 1).toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentYear.toString()}
            onValueChange={(value) => onUpdateYear(Number.parseInt(value))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un collaborateur..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select
            value={sortBy}
            onValueChange={onSort}
          >
            <SelectTrigger className="w-[180px]">
              <ArrowDownAZ className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nom</SelectItem>
              <SelectItem value="amount_desc">Montant ↓</SelectItem>
              <SelectItem value="amount_asc">Montant ↑</SelectItem>
              <SelectItem value="activities">Nombre d'activités</SelectItem>
              <SelectItem value="trend">Progression</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs
          defaultValue="all"
          value={selectedService || "all"}
          onValueChange={(value) => onUpdateService(value === "all" ? null : value)}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-4 md:grid-cols-7 w-full md:w-auto">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value={ServiceType.TECHNICAL_VISIT}>Visite</TabsTrigger>
            <TabsTrigger value={ServiceType.INSTALLATION}>Installation</TabsTrigger>
            <TabsTrigger value={ServiceType.QUALIFICATION}>Qualification</TabsTrigger>
            <TabsTrigger value={ServiceType.CONFIRMATION}>Confirmation</TabsTrigger>
            <TabsTrigger value={ServiceType.ADMINISTRATIVE}>Admin</TabsTrigger>
            <TabsTrigger value={ServiceType.BILLING}>Facturation</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
