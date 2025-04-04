"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle, RotateCw, ArrowRight } from "lucide-react";

interface ServiceIntegrationStatusProps {
  servicesStatus: {
    confirmation: { status: string; pending: number };
    administrative: { status: string; pending: number };
    technicalVisit: { status: string; pending: number };
    installation: { status: string; pending: number };
    billing: { status: string; pending: number };
  };
}

export function ServiceIntegrationStatus({ servicesStatus }: ServiceIntegrationStatusProps) {
  // Convertir le statut en badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Opérationnel
          </Badge>
        );
      case "issue":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Problème
          </Badge>
        );
      case "down":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Indisponible
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/20">
            Inconnu
          </Badge>
        );
    }
  };

  // Calculer une fiabilité fictive basée sur le statut
  const getReliability = (status: string) => {
    switch (status) {
      case "operational":
        return 98 + Math.floor(Math.random() * 3);
      case "issue":
        return 80 + Math.floor(Math.random() * 10);
      case "down":
        return 0;
      default:
        return 90;
    }
  };

  return (
    <div className="space-y-6">
      {/* Résumé global des intégrations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900/50 p-4 rounded-md border border-gray-800">
          <div className="text-2xl font-bold text-green-500">4/5</div>
          <p className="text-gray-400">Services opérationnels</p>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-md border border-gray-800">
          <div className="text-2xl font-bold">62</div>
          <p className="text-gray-400">Transferts en attente</p>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-md border border-gray-800">
          <div className="text-2xl font-bold text-blue-500">93%</div>
          <p className="text-gray-400">Taux de réussite API</p>
        </div>
      </div>

      {/* Graphique des flux entre services */}
      <div className="border border-gray-800 rounded-md p-4 bg-gray-900/30">
        <h3 className="text-sm font-medium mb-4">Flux de traitement inter-services</h3>
        <div className="relative py-6">
          {/* Service Confirmation */}
          <div className="flex items-center mb-6">
            <div className="w-1/5 text-right pr-4">
              <div className="font-medium">Confirmation</div>
              <div className="text-xs text-gray-400">Qualifie les dossiers</div>
            </div>
            <div className="w-3/5 px-4">
              <div className="flex items-center">
                <div
                  className={`h-12 rounded-md ${
                    servicesStatus.confirmation.status === "operational"
                      ? "bg-blue-500/20 border border-blue-500/30"
                      : "bg-gray-800 border border-gray-700"
                  } w-full flex items-center justify-center`}
                >
                  <Badge variant="outline" className="bg-gray-800 border-gray-700">
                    {servicesStatus.confirmation.pending} en attente
                  </Badge>
                </div>
                <ArrowRight className="mx-2 text-gray-400" />
              </div>
            </div>
            <div className="w-1/5">{getStatusBadge(servicesStatus.confirmation.status)}</div>
          </div>

          {/* Service Administratif */}
          <div className="flex items-center mb-6">
            <div className="w-1/5 text-right pr-4">
              <div className="font-medium">Administratif</div>
              <div className="text-xs text-gray-400">Vérifie les documents</div>
            </div>
            <div className="w-3/5 px-4">
              <div className="flex items-center">
                <div
                  className={`h-12 rounded-md ${
                    servicesStatus.administrative.status === "operational"
                      ? "bg-purple-500/20 border border-purple-500/30"
                      : "bg-gray-800 border border-gray-700"
                  } w-full flex items-center justify-center`}
                >
                  <Badge variant="outline" className="bg-gray-800 border-gray-700">
                    {servicesStatus.administrative.pending} en attente
                  </Badge>
                </div>
                <ArrowRight className="mx-2 text-gray-400" />
              </div>
            </div>
            <div className="w-1/5">{getStatusBadge(servicesStatus.administrative.status)}</div>
          </div>

          {/* Service Visite Technique */}
          <div className="flex items-center mb-6">
            <div className="w-1/5 text-right pr-4">
              <div className="font-medium">Visite Technique</div>
              <div className="text-xs text-gray-400">Planifie les visites</div>
            </div>
            <div className="w-3/5 px-4">
              <div className="flex items-center">
                <div
                  className={`h-12 rounded-md ${
                    servicesStatus.technicalVisit.status === "operational"
                      ? "bg-yellow-500/20 border border-yellow-500/30"
                      : "bg-gray-800 border border-gray-700"
                  } w-full flex items-center justify-center`}
                >
                  <Badge variant="outline" className="bg-gray-800 border-gray-700">
                    {servicesStatus.technicalVisit.pending} en attente
                  </Badge>
                </div>
                <ArrowRight className="mx-2 text-gray-400" />
              </div>
            </div>
            <div className="w-1/5">{getStatusBadge(servicesStatus.technicalVisit.status)}</div>
          </div>

          {/* Service Installation */}
          <div className="flex items-center mb-6">
            <div className="w-1/5 text-right pr-4">
              <div className="font-medium">Installation</div>
              <div className="text-xs text-gray-400">Réalise les travaux</div>
            </div>
            <div className="w-3/5 px-4">
              <div className="flex items-center">
                <div
                  className={`h-12 rounded-md ${
                    servicesStatus.installation.status === "operational"
                      ? "bg-green-500/20 border border-green-500/30"
                      : "bg-gray-800 border border-gray-700"
                  } w-full flex items-center justify-center`}
                >
                  <Badge variant="outline" className="bg-gray-800 border-gray-700">
                    {servicesStatus.installation.pending} en attente
                  </Badge>
                </div>
                <ArrowRight className="mx-2 text-gray-400" />
              </div>
            </div>
            <div className="w-1/5">{getStatusBadge(servicesStatus.installation.status)}</div>
          </div>

          {/* Service Facturation */}
          <div className="flex items-center">
            <div className="w-1/5 text-right pr-4">
              <div className="font-medium">Facturation</div>
              <div className="text-xs text-gray-400">Finalise le paiement</div>
            </div>
            <div className="w-3/5 px-4">
              <div className="flex items-center">
                <div
                  className={`h-12 rounded-md ${
                    servicesStatus.billing.status === "operational"
                      ? "bg-rose-500/20 border border-rose-500/30"
                      : "bg-gray-800 border border-gray-700"
                  } w-full flex items-center justify-center`}
                >
                  <Badge variant="outline" className="bg-gray-800 border-gray-700">
                    {servicesStatus.billing.pending} en attente
                  </Badge>
                </div>
              </div>
            </div>
            <div className="w-1/5">{getStatusBadge(servicesStatus.billing.status)}</div>
          </div>
        </div>
      </div>

      {/* Statut des APIs externes */}
      <div className="border border-gray-800 rounded-md p-4 bg-gray-900/30">
        <h3 className="text-sm font-medium mb-4">Statut des APIs externes</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>API Anah</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={99} className="w-32 h-2" />
              <span className="text-xs text-gray-400">99.5% disponibilité</span>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <RotateCw className="h-3 w-3 mr-1" />
                Tester
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span>API MaPrimeRénov</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={85} className="w-32 h-2" />
              <span className="text-xs text-gray-400">85.2% disponibilité</span>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <RotateCw className="h-3 w-3 mr-1" />
                Tester
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>API Signatures Électroniques</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={98} className="w-32 h-2" />
              <span className="text-xs text-gray-400">98.7% disponibilité</span>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <RotateCw className="h-3 w-3 mr-1" />
                Tester
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>API Archivage Documents</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={96} className="w-32 h-2" />
              <span className="text-xs text-gray-400">96.1% disponibilité</span>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <RotateCw className="h-3 w-3 mr-1" />
                Tester
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
