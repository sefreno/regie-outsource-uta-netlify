"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  Bell,
  Clock,
  CheckCircle,
  Search,
  Filter,
  FileWarning,
  AlertTriangle,
  Ban,
  CalendarClock
} from "lucide-react";

export function AlertsList() {
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Données fictives pour les alertes
  const alerts = [
    {
      id: "alert-001",
      type: "deadline",
      severity: "high",
      message: "Délai dépassé pour soumission MPR",
      client: "Martin Dupont",
      reference: "MPR-2024-001",
      createdAt: "2024-03-18T10:30:00",
      service: "administrative",
    },
    {
      id: "alert-002",
      type: "document",
      severity: "medium",
      message: "Document manquant : Attestation domicile",
      client: "Sophie Bernard",
      reference: "DOC-2024-045",
      createdAt: "2024-03-17T14:15:00",
      service: "confirmation",
    },
    {
      id: "alert-003",
      type: "api",
      severity: "high",
      message: "Échec de communication API Anah",
      client: "Jean Petit",
      reference: "API-2024-012",
      createdAt: "2024-03-19T09:45:00",
      service: "technical-visit",
    },
    {
      id: "alert-004",
      type: "workflow",
      severity: "low",
      message: "Attente validation responsable",
      client: "Marie Laurent",
      reference: "VALID-2024-023",
      createdAt: "2024-03-15T16:20:00",
      service: "installation",
    },
    {
      id: "alert-005",
      type: "deadline",
      severity: "medium",
      message: "Approche délai règlementaire (J-3)",
      client: "Philippe Martin",
      reference: "DEAD-2024-034",
      createdAt: "2024-03-16T11:10:00",
      service: "billing",
    },
    {
      id: "alert-006",
      type: "document",
      severity: "high",
      message: "Signature manquante sur contrat",
      client: "Élise Moreau",
      reference: "SIGN-2024-007",
      createdAt: "2024-03-19T13:25:00",
      service: "confirmation",
    },
  ];

  // Filtrer les alertes
  const filteredAlerts = alerts.filter((alert) => {
    const matchesFilter = filter === "all" || alert.severity === filter || alert.type === filter;
    const matchesSearch = searchTerm === "" ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.reference.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Obtenir une icône en fonction du type d'alerte
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "deadline":
        return <CalendarClock className="h-4 w-4 text-orange-500" />;
      case "document":
        return <FileWarning className="h-4 w-4 text-yellow-500" />;
      case "api":
        return <Ban className="h-4 w-4 text-red-500" />;
      case "workflow":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  // Obtenir un badge en fonction de la sévérité
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Critique
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Moyenne
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 flex items-center gap-1">
            <Bell className="h-3 w-3" /> Faible
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/20">
            Information
          </Badge>
        );
    }
  };

  // Format de date relatif
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60); // Minutes

    if (diff < 60) {
      return `Il y a ${diff} min`;
    } else if (diff < 1440) {
      const hours = Math.floor(diff / 60);
      return `Il y a ${hours} h`;
    } else {
      return date.toLocaleDateString("fr-FR");
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher par message, client ou référence..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les alertes</SelectItem>
            <SelectItem value="high">Sévérité : Critique</SelectItem>
            <SelectItem value="medium">Sévérité : Moyenne</SelectItem>
            <SelectItem value="low">Sévérité : Faible</SelectItem>
            <SelectItem value="deadline">Type : Délai</SelectItem>
            <SelectItem value="document">Type : Document</SelectItem>
            <SelectItem value="api">Type : API</SelectItem>
            <SelectItem value="workflow">Type : Workflow</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Résumé des alertes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-900/50 p-3 rounded-md border border-gray-800 flex items-center">
          <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center mr-3">
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <div>
            <div className="text-sm font-medium">Alertes critiques</div>
            <div className="text-xs text-gray-400">
              {alerts.filter(a => a.severity === "high").length} alertes
            </div>
          </div>
        </div>
        <div className="bg-gray-900/50 p-3 rounded-md border border-gray-800 flex items-center">
          <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center mr-3">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </div>
          <div>
            <div className="text-sm font-medium">Alertes moyennes</div>
            <div className="text-xs text-gray-400">
              {alerts.filter(a => a.severity === "medium").length} alertes
            </div>
          </div>
        </div>
        <div className="bg-gray-900/50 p-3 rounded-md border border-gray-800 flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
            <Bell className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <div className="text-sm font-medium">Alertes faibles</div>
            <div className="text-xs text-gray-400">
              {alerts.filter(a => a.severity === "low").length} alertes
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des alertes */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[16px]"></TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Référence</TableHead>
            <TableHead>Sévérité</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAlerts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                Aucune alerte ne correspond à vos critères de filtrage
              </TableCell>
            </TableRow>
          ) : (
            filteredAlerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>{getAlertIcon(alert.type)}</TableCell>
                <TableCell className="font-medium">{alert.message}</TableCell>
                <TableCell>{alert.client}</TableCell>
                <TableCell>{alert.reference}</TableCell>
                <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                <TableCell className="text-gray-400">{getRelativeTime(alert.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Résoudre
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
