"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MessageThread } from "@/components/management/message-thread";
import { MessagingService } from "@/lib/messaging/service";
import { type MessageThread as MessageThreadType, type MessageUser, ServiceType } from "@/lib/messaging/models";
import {
  MessageSquare,
  Search,
  Users,
  Bell,
  Clock,
  Filter,
  PlusCircle
} from "lucide-react";

export default function MessagesPage() {
  const [messageService] = useState(new MessagingService());
  const [threads, setThreads] = useState<MessageThreadType[]>([]);
  const [users, setUsers] = useState<MessageUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);

  // Simuler l'utilisateur actuellement connecté
  const currentUserId = "user_006"; // Julie Moreau (gestion)

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const allUsers = await messageService.getAvailableUsers();
        setUsers(allUsers);

        const allThreads = await messageService.getAllThreads();
        setThreads(allThreads);

        // Récupérer les notifications non lues
        const notifications = await messageService.getUnreadNotifications(currentUserId);
        setUnreadNotifications(notifications.length);

        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des messages:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrer les fils de discussion en fonction du terme de recherche et de l'onglet actif
  const filteredThreads = threads.filter(thread => {
    // Filtrer par terme de recherche
    const matchesSearch =
      searchTerm === "" ||
      thread.dossierRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.dossierTitle.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtrer par onglet actif
    if (activeTab === "all") {
      return matchesSearch;
    } else if (activeTab === "unread") {
      return matchesSearch && thread.metadata?.unreadMessages[currentUserId] > 0;
    } else if (activeTab === "my_mentions") {
      // Vérifier si l'utilisateur est mentionné dans un message
      const isMentioned = thread.messages.some(message =>
        message.mentions?.some(mention => mention.userId === currentUserId)
      );
      return matchesSearch && isMentioned;
    }

    return matchesSearch;
  });

  // Trier les fils par date de dernière activité
  const sortedThreads = [...filteredThreads].sort((a, b) => {
    const dateA = a.metadata?.lastActivity || a.updatedAt;
    const dateB = b.metadata?.lastActivity || b.updatedAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  // Trouver le fil de discussion actif
  const activeThread = activeThreadId
    ? threads.find(t => t.id === activeThreadId)
    : sortedThreads.length > 0 ? sortedThreads[0] : null;

  // Envoyer un nouveau message
  const handleSendMessage = async (content: string, files: File[], mentions: string[]) => {
    if (!activeThread) return;

    try {
      // Ajouter le message au fil de discussion
      await messageService.addMessage(
        activeThread.id,
        currentUserId,
        content,
        [], // Attachments - dans une vraie implémentation, il faudrait convertir les fichiers
        mentions
      );

      // Recharger tous les fils
      const updatedThreads = await messageService.getAllThreads();
      setThreads(updatedThreads);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  // Marquer un message comme lu
  const handleMarkAsRead = async (messageId: string) => {
    try {
      await messageService.markMessageAsRead(messageId, currentUserId);

      // Recharger tous les fils
      const updatedThreads = await messageService.getAllThreads();
      setThreads(updatedThreads);

      // Mettre à jour le compteur de notifications
      const notifications = await messageService.getUnreadNotifications(currentUserId);
      setUnreadNotifications(notifications.length);
    } catch (error) {
      console.error("Erreur lors du marquage du message comme lu:", error);
    }
  };

  // Marquer tous les messages d'un fil comme lus
  const handleMarkThreadAsRead = async (threadId: string) => {
    try {
      await messageService.markThreadAsRead(threadId, currentUserId);

      // Recharger tous les fils
      const updatedThreads = await messageService.getAllThreads();
      setThreads(updatedThreads);

      // Mettre à jour le compteur de notifications
      const notifications = await messageService.getUnreadNotifications(currentUserId);
      setUnreadNotifications(notifications.length);
    } catch (error) {
      console.error("Erreur lors du marquage du fil comme lu:", error);
    }
  };

  // Obtenir la couleur d'un service
  const getServiceColor = (service: ServiceType): string => {
    const colors: Record<ServiceType, string> = {
      [ServiceType.CONFIRMATION]: 'bg-blue-500',
      [ServiceType.ADMINISTRATIVE]: 'bg-purple-500',
      [ServiceType.TECHNICAL_VISIT]: 'bg-yellow-500',
      [ServiceType.INSTALLATION]: 'bg-green-500',
      [ServiceType.BILLING]: 'bg-rose-500',
      [ServiceType.MANAGEMENT]: 'bg-indigo-500',
    };
    return colors[service] || 'bg-gray-500';
  };

  // Formater la date du dernier message
  const formatLastActivity = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffMinutes > 0) {
      return `il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    } else {
      return "à l'instant";
    }
  };

  // Afficher un extrait du dernier message
  const getLastMessagePreview = (thread: MessageThreadType) => {
    if (thread.messages.length === 0) return "Aucun message";

    const lastMessage = thread.messages[thread.messages.length - 1];
    const maxLength = 60;

    if (lastMessage.content.length <= maxLength) {
      return lastMessage.content;
    }

    return lastMessage.content.substring(0, maxLength) + "...";
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
                <p className="text-gray-400">Chargement des messages...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Messages inter-services</h1>
              <p className="text-gray-400">
                Communication centralisée pour tous les dossiers
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Nouvelle discussion
              </Button>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Bell className="h-3.5 w-3.5" />
                {unreadNotifications} notification{unreadNotifications !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Liste des fils de discussion */}
            <div className="md:col-span-1">
              <Card className="border-gray-800">
                <CardHeader className="pb-2">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">Discussions</CardTitle>

                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Rechercher un dossier..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">Tous</TabsTrigger>
                        <TabsTrigger value="unread">
                          Non lus
                          {threads.reduce((count, thread) => count + (thread.metadata?.unreadMessages[currentUserId] || 0), 0) > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                              {threads.reduce((count, thread) => count + (thread.metadata?.unreadMessages[currentUserId] || 0), 0)}
                            </Badge>
                          )}
                        </TabsTrigger>
                        <TabsTrigger value="my_mentions">Mentions</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="pt-0 p-0 max-h-[70vh] overflow-y-auto">
                  {sortedThreads.length === 0 ? (
                    <div className="py-8 text-center text-gray-400">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                      <p>Aucune discussion trouvée</p>
                    </div>
                  ) : (
                    <div>
                      {sortedThreads.map((thread) => (
                        <div
                          key={thread.id}
                          className={`p-3 border-b border-gray-800 hover:bg-gray-900/50 cursor-pointer transition-colors ${
                            activeThreadId === thread.id ? 'bg-gray-900/80' : ''
                          } ${
                            thread.metadata?.unreadMessages[currentUserId] > 0 ? 'border-l-2 border-l-primary' : ''
                          }`}
                          onClick={() => {
                            setActiveThreadId(thread.id);
                            if (thread.metadata?.unreadMessages[currentUserId] > 0) {
                              handleMarkThreadAsRead(thread.id);
                            }
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium flex items-center gap-1.5">
                                {thread.dossierRef}
                                {thread.metadata?.unreadMessages[currentUserId] > 0 && (
                                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                                    {thread.metadata.unreadMessages[currentUserId]} non lu{thread.metadata.unreadMessages[currentUserId] > 1 ? 's' : ''}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-400">{thread.dossierTitle}</div>
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatLastActivity(thread.metadata?.lastActivity || thread.updatedAt)}
                            </div>
                          </div>

                          {thread.messages.length > 0 && (
                            <div className="mt-1 flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <div className={`h-full w-full flex items-center justify-center text-primary-foreground ${
                                  getServiceColor(thread.messages[thread.messages.length - 1].sender.service)
                                }`}>
                                  {thread.messages[thread.messages.length - 1].sender.name.charAt(0)}
                                </div>
                              </Avatar>
                              <p className="text-sm text-gray-300 line-clamp-1">{getLastMessagePreview(thread)}</p>
                            </div>
                          )}

                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                            <Users className="h-3 w-3" />
                            <span>{thread.participants.length} participants</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Affichage du fil sélectionné */}
            <div className="md:col-span-2">
              {activeThread ? (
                <MessageThread
                  dossierRef={activeThread.dossierRef}
                  dossierTitle={activeThread.dossierTitle}
                  messages={activeThread.messages}
                  onSendMessage={handleSendMessage}
                  onMarkAsRead={handleMarkAsRead}
                  availableUsers={users}
                />
              ) : (
                <Card className="border-gray-800 h-full">
                  <CardContent className="flex flex-col items-center justify-center h-96 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium mb-1">Aucune discussion sélectionnée</h3>
                    <p className="text-gray-400 max-w-md mb-4">
                      Sélectionnez une discussion dans la liste ou créez une nouvelle conversation entre services.
                    </p>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Nouvelle discussion
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
