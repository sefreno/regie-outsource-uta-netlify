"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { MessageThread } from "@/components/management/message-thread";
import { MessagingService } from "@/lib/messaging/service";
import type { MessageAttachment } from "@/lib/messaging/models";
import {
  ArrowLeft,
  Clipboard,
  FileText,
  Users,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  LayoutList,
  Send,
  MessageSquare
} from "lucide-react";

export default function WorkflowDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [workflowData, setWorkflowData] = useState<any>(null);
  const [messageService] = useState(new MessagingService());
  const [messageThread, setMessageThread] = useState<any>(null);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  // Simuler le chargement des données
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Données fictives pour un dossier
      setTimeout(async () => {
        setWorkflowData({
          id: id,
          reference: `WF-${id}`,
          client: {
            name: "Martin Dupont",
            email: "martin.dupont@example.com",
            phone: "06 12 34 56 78",
            address: "15 rue des Lilas, 75020 Paris"
          },
          status: "enrichment", // reception, verification, enrichment, submission, monitoring, closure
          progress: 42,
          startDate: "2024-02-15",
          currentStep: {
            name: "Enrichissement",
            description: "Ajout des données techniques",
            deadline: "2024-04-10",
            assignedTo: "Sophie Bernard",
            daysRemaining: 8
          },
          documents: [
            { name: "Avis d'imposition 2024", status: "complete", date: "2024-03-10" },
            { name: "Devis signé", status: "complete", date: "2024-03-12" },
            { name: "Rapport technique", status: "pending", date: "2024-03-18" },
            { name: "Photos installation", status: "missing", date: null },
            { name: "Attestation fin de travaux", status: "not_required", date: null }
          ],
          steps: [
            { name: "Réception", date: "2024-02-15", status: "completed" },
            { name: "Vérification", date: "2024-02-28", status: "completed" },
            { name: "Enrichissement", date: "2024-03-15", status: "in_progress" },
            { name: "Soumission", date: null, status: "pending" },
            { name: "Suivi", date: null, status: "pending" },
            { name: "Clôture", date: null, status: "pending" }
          ],
          history: [
            { action: "Dossier créé", date: "2024-02-15T10:30:00", user: "Jean Martin" },
            { action: "Documents fiscaux reçus", date: "2024-02-20T14:15:00", user: "Marie Dubois" },
            { action: "Vérification complétée", date: "2024-02-28T11:45:00", user: "Pierre Dupont" },
            { action: "Transmission au service technique", date: "2024-03-05T09:20:00", user: "Sophie Bernard" },
            { action: "Rendez-vous planifié", date: "2024-03-15T15:30:00", user: "Thomas Leclerc" },
            { action: "Rapport technique reçu", date: "2024-03-18T16:45:00", user: "Julie Moreau" }
          ],
          alerts: [
            { type: "deadline", severity: "medium", message: "Date limite d'enrichissement approche (J-8)" },
            { type: "document", severity: "high", message: "Photos d'installation manquantes" }
          ]
        });

        // Charger le thread de messages pour ce dossier
        await loadMessageThread();
        await loadUsers();

        setIsLoading(false);
      }, 1000);
    };

    loadData();
  }, [id]);

  // Charger le fil de discussion pour ce dossier
  const loadMessageThread = async () => {
    try {
      let thread = await messageService.getThreadByDossierRef(`WF-${id}`);

      // Si aucun fil n'existe pour ce dossier, en créer un nouveau
      if (!thread) {
        thread = await messageService.createThread(
          `WF-${id}`,
          `Dossier WF-${id}`,
          ["user_001", "user_002", "user_003", "user_004", "user_005", "user_006"]
        );
      }

      setMessageThread(thread);
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
    }
  };

  // Charger la liste des utilisateurs
  const loadUsers = async () => {
    try {
      const users = await messageService.getAvailableUsers();
      setAvailableUsers(users);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    }
  };

  // Envoyer un nouveau message
  const handleSendMessage = async (content: string, files: File[], mentions: string[]) => {
    if (!messageThread) return;

    try {
      // Simuler un utilisateur connecté
      const currentUserId = "user_006"; // Julie Moreau (gestion)

      // Convertir les fichiers en pièces jointes
      const attachments: MessageAttachment[] = files.map(file => ({
        id: `attach_${Math.random().toString(36).substring(2, 15)}`,
        name: file.name,
        type: file.type.split('/')[0], // "image", "application", etc.
        size: `${(file.size / 1024).toFixed(0)} KB`,
        url: URL.createObjectURL(file),
        uploadedAt: new Date(),
        contentType: file.type,
      }));

      // Ajouter le message au fil de discussion
      const message = await messageService.addMessage(
        messageThread.id,
        currentUserId,
        content,
        attachments,
        mentions
      );

      // Recharger le fil de discussion
      await loadMessageThread();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  // Marquer un message comme lu
  const handleMarkAsRead = async (messageId: string) => {
    try {
      // Simuler un utilisateur connecté
      const currentUserId = "user_006"; // Julie Moreau (gestion)

      await messageService.markMessageAsRead(messageId, currentUserId);

      // Recharger le fil de discussion
      await loadMessageThread();
    } catch (error) {
      console.error("Erreur lors du marquage du message comme lu:", error);
    }
  };

  // Si les données sont en cours de chargement
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-400">Chargement du dossier...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Si le dossier n'existe pas
  if (!workflowData) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-bold mb-4">Dossier non trouvé</h2>
              <p className="text-gray-400 mb-6">Le dossier demandé n'existe pas ou a été supprimé.</p>
              <Button onClick={() => router.push('/management/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au tableau de bord
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Obtenir un badge pour le statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reception":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Réception</Badge>;
      case "verification":
        return <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">Vérification</Badge>;
      case "enrichment":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">Enrichissement</Badge>;
      case "submission":
        return <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20">Soumission</Badge>;
      case "monitoring":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">Suivi</Badge>;
      case "closure":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Clôture</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/20">Inconnu</Badge>;
    }
  };

  // Obtenir un badge pour le statut d'un document
  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Complet
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            En cours
          </Badge>
        );
      case "missing":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Manquant
          </Badge>
        );
      case "not_required":
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/20">
            Non requis
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

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          {/* En-tête */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                className="mr-4"
                onClick={() => router.push('/management/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Clipboard className="h-5 w-5 text-gray-400" />
                  Dossier {workflowData.reference}
                  {getStatusBadge(workflowData.status)}
                </h1>
                <p className="text-gray-400">
                  Client: {workflowData.client.name}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Transmettre
              </Button>
            </div>
          </div>

          {/* Progression */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progression globale</span>
                  <span className="font-medium">{workflowData.progress}%</span>
                </div>
                <Progress value={workflowData.progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Réception</span>
                  <span>Vérification</span>
                  <span>Enrichissement</span>
                  <span>Soumission</span>
                  <span>Suivi</span>
                  <span>Clôture</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contenu principal avec onglets */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                <LayoutList className="h-4 w-4 mr-2" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="messages">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
                {messageThread?.metadata?.unreadMessages?.user_006 > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {messageThread.metadata.unreadMessages.user_006}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="history">
                <Calendar className="h-4 w-4 mr-2" />
                Historique
              </TabsTrigger>
            </TabsList>

            {/* Onglet Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Informations client */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Users className="h-5 w-5 mr-2 text-gray-400" />
                      Informations client
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">{workflowData.client.name}</h3>
                      <p className="text-sm text-gray-400">{workflowData.client.email}</p>
                      <p className="text-sm text-gray-400">{workflowData.client.phone}</p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium">Adresse</h4>
                      <p className="text-sm text-gray-400">{workflowData.client.address}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Étape actuelle */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <LayoutList className="h-5 w-5 mr-2 text-gray-400" />
                      Étape actuelle
                    </CardTitle>
                    <CardDescription>
                      {workflowData.currentStep.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm text-gray-400">Responsable</h4>
                        <p className="font-medium">{workflowData.currentStep.assignedTo}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-400">Date limite</h4>
                        <p className="font-medium flex items-center">
                          {new Date(workflowData.currentStep.deadline).toLocaleDateString("fr-FR")}
                          <Badge variant="outline" className="ml-2 bg-blue-500/10 text-blue-500 border-blue-500/20">
                            J-{workflowData.currentStep.daysRemaining}
                          </Badge>
                        </p>
                      </div>
                    </div>
                    <Separator />
                    {/* Alertes actives */}
                    {workflowData.alerts.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Alertes actives</h4>
                        <div className="space-y-2">
                          {workflowData.alerts.map((alert: any, index: number) => (
                            <div key={index} className="p-2 rounded-md bg-gray-800 flex items-start">
                              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                              <p className="text-sm">{alert.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Timeline des étapes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progression du dossier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Ligne de progression */}
                    <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gray-800"></div>

                    {/* Étapes */}
                    <div className="space-y-8">
                      {workflowData.steps.map((step: any, index: number) => (
                        <div key={index} className="relative pl-10">
                          {/* Marqueur d'étape */}
                          <div className={`absolute left-0 top-0 w-[30px] h-[30px] rounded-full flex items-center justify-center ${
                            step.status === 'completed'
                              ? 'bg-green-500/20 border border-green-500'
                              : step.status === 'in_progress'
                                ? 'bg-blue-500/20 border border-blue-500'
                                : 'bg-gray-800 border border-gray-700'
                          }`}>
                            {step.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                            {step.status === 'in_progress' && <div className="h-2 w-2 rounded-full bg-blue-500"></div>}
                          </div>

                          {/* Contenu de l'étape */}
                          <div>
                            <h3 className="font-medium flex items-center gap-2">
                              {step.name}
                              {step.status === 'completed' && (
                                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                  Complété
                                </Badge>
                              )}
                              {step.status === 'in_progress' && (
                                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                                  En cours
                                </Badge>
                              )}
                            </h3>
                            {step.date && (
                              <p className="text-sm text-gray-400">
                                {new Date(step.date).toLocaleDateString("fr-FR")}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Documents */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Liste des documents</CardTitle>
                  <CardDescription>
                    Documents requis pour le traitement du dossier
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workflowData.documents.map((doc: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-800 rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            {doc.date && (
                              <p className="text-xs text-gray-400">
                                Reçu le {new Date(doc.date).toLocaleDateString("fr-FR")}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getDocumentStatusBadge(doc.status)}

                          {doc.status === "complete" && (
                            <Button variant="ghost" size="sm">
                              Voir
                            </Button>
                          )}

                          {doc.status === "missing" && (
                            <Button variant="outline" size="sm">
                              Demander
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Messages */}
            <TabsContent value="messages">
              {messageThread && (
                <MessageThread
                  dossierRef={workflowData.reference}
                  dossierTitle={workflowData.client.name}
                  messages={messageThread.messages}
                  onSendMessage={handleSendMessage}
                  onMarkAsRead={handleMarkAsRead}
                  availableUsers={availableUsers}
                />
              )}
            </TabsContent>

            {/* Onglet Historique */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Historique des actions</CardTitle>
                  <CardDescription>
                    Chronologie complète du dossier
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Ligne de progression */}
                    <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gray-800"></div>

                    {/* Actions */}
                    <div className="space-y-6">
                      {workflowData.history.map((item: any, index: number) => (
                        <div key={index} className="relative pl-10">
                          {/* Marqueur d'action */}
                          <div className="absolute left-0 top-0 w-[30px] h-[30px] rounded-full bg-gray-800 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          </div>

                          {/* Contenu de l'action */}
                          <div>
                            <h3 className="font-medium">{item.action}</h3>
                            <p className="text-sm text-gray-400">
                              {new Date(item.date).toLocaleDateString("fr-FR")} à {new Date(item.date).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })} par {item.user}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
