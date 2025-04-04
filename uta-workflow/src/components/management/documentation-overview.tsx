"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Download, Clock, CheckCircle, AlertCircle, FileText, FileCheck } from "lucide-react";

export function DocumentationOverview() {
  const [searchTerm, setSearchTerm] = useState("");

  // Données fictives pour les documents
  const documents = [
    {
      id: "doc-001",
      name: "Avis d'imposition 2024",
      type: "document-fiscal",
      client: "Martin Dupont",
      status: "complete",
      progress: 100,
      date: "2024-03-15",
      size: "1.7 MB",
    },
    {
      id: "doc-002",
      name: "Rapport technique - PAC",
      type: "rapport-technique",
      client: "Sophie Bernard",
      status: "pending",
      progress: 65,
      date: "2024-03-17",
      size: "3.2 MB",
    },
    {
      id: "doc-003",
      name: "Devis signé - Isolation",
      type: "contrat",
      client: "Jean Petit",
      status: "pending",
      progress: 80,
      date: "2024-03-18",
      size: "0.8 MB",
    },
    {
      id: "doc-004",
      name: "Facture installation",
      type: "facture",
      client: "Marie Laurent",
      status: "complete",
      progress: 100,
      date: "2024-03-10",
      size: "0.5 MB",
    },
    {
      id: "doc-005",
      name: "Attestation fin travaux",
      type: "attestation",
      client: "Philippe Martin",
      status: "attention",
      progress: 40,
      date: "2024-03-19",
      size: "0.3 MB",
    },
    {
      id: "doc-006",
      name: "Photos après travaux",
      type: "photos",
      client: "Élise Moreau",
      status: "complete",
      progress: 100,
      date: "2024-03-12",
      size: "4.5 MB",
    },
  ];

  // Filtrer les documents par le terme de recherche
  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Complet
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 flex items-center gap-1">
            <Clock className="h-3 w-3" /> En cours
          </Badge>
        );
      case "attention":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Attention
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

  // Icône pour le type de document
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "document-fiscal":
      case "facture":
        return <FileText className="h-4 w-4 mr-2 text-gray-400" />;
      case "rapport-technique":
      case "contrat":
      case "attestation":
        return <FileCheck className="h-4 w-4 mr-2 text-gray-400" />;
      default:
        return <FileText className="h-4 w-4 mr-2 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Rechercher par nom, client ou type..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Résumé des types de documents */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-900/50 p-3 rounded-md border border-gray-800 flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
            <FileText className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <div className="text-sm font-medium">Documents fiscaux</div>
            <div className="text-xs text-gray-400">18 fichiers</div>
          </div>
        </div>
        <div className="bg-gray-900/50 p-3 rounded-md border border-gray-800 flex items-center">
          <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center mr-3">
            <FileCheck className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <div className="text-sm font-medium">Rapports techniques</div>
            <div className="text-xs text-gray-400">24 fichiers</div>
          </div>
        </div>
        <div className="bg-gray-900/50 p-3 rounded-md border border-gray-800 flex items-center">
          <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center mr-3">
            <FileText className="h-4 w-4 text-purple-500" />
          </div>
          <div>
            <div className="text-sm font-medium">Devis et factures</div>
            <div className="text-xs text-gray-400">36 fichiers</div>
          </div>
        </div>
        <div className="bg-gray-900/50 p-3 rounded-md border border-gray-800 flex items-center">
          <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center mr-3">
            <FileCheck className="h-4 w-4 text-orange-500" />
          </div>
          <div>
            <div className="text-sm font-medium">Attestations</div>
            <div className="text-xs text-gray-400">15 fichiers</div>
          </div>
        </div>
      </div>

      {/* Tableau des documents */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Client</TableHead>
            <TableHead className="w-[100px]">Statut</TableHead>
            <TableHead className="w-[180px]">Progression</TableHead>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDocuments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                Aucun document ne correspond à votre recherche
              </TableCell>
            </TableRow>
          ) : (
            filteredDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium flex items-center">
                  {getDocumentIcon(doc.type)}
                  <span>{doc.name}</span>
                </TableCell>
                <TableCell>{doc.client}</TableCell>
                <TableCell>{getStatusBadge(doc.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={doc.progress} className="h-2" />
                    <span className="text-xs text-gray-400">{doc.progress}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-400">
                  {new Date(doc.date).toLocaleDateString("fr-FR")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
