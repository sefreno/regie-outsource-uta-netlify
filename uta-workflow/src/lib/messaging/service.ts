/**
 * Service de gestion des messages entre services pour le suivi des dossiers
 */

import { v4 as uuidv4 } from 'uuid';
import {
  type Message,
  type MessageThread,
  type MessageAttachment,
  type MessageUser,
  type MessageNotification,
  ServiceType
} from './models';

// Classe pour gérer les messages entre services
export class MessagingService {
  private mockUsers: MessageUser[] = [
    {
      id: "user_001",
      name: "Jean Martin",
      email: "jean.martin@example.com",
      service: ServiceType.CONFIRMATION,
      role: "Agent de confirmation",
    },
    {
      id: "user_002",
      name: "Marie Dubois",
      email: "marie.dubois@example.com",
      service: ServiceType.ADMINISTRATIVE,
      role: "Responsable administratif",
    },
    {
      id: "user_003",
      name: "Pierre Dupont",
      email: "pierre.dupont@example.com",
      service: ServiceType.TECHNICAL_VISIT,
      role: "Technicien",
    },
    {
      id: "user_004",
      name: "Sophie Bernard",
      email: "sophie.bernard@example.com",
      service: ServiceType.INSTALLATION,
      role: "Installateur",
    },
    {
      id: "user_005",
      name: "Thomas Leclerc",
      email: "thomas.leclerc@example.com",
      service: ServiceType.BILLING,
      role: "Comptable",
    },
    {
      id: "user_006",
      name: "Julie Moreau",
      email: "julie.moreau@example.com",
      service: ServiceType.MANAGEMENT,
      role: "Gestionnaire de workflow",
    },
  ];

  private mockThreads: MessageThread[] = [];
  private mockNotifications: MessageNotification[] = [];

  constructor() {
    // Initialiser des fils de discussion fictifs pour la démo
    this.initializeMockData();
  }

  private initializeMockData() {
    // Créer quelques fils de discussion de démonstration
    const thread1: MessageThread = {
      id: "thread_001",
      dossierRef: "WF-001",
      dossierTitle: "Installation PAC M. Dupont",
      createdAt: new Date(2024, 2, 15),
      updatedAt: new Date(2024, 2, 20),
      participants: ["user_001", "user_003", "user_004", "user_006"],
      messages: [
        {
          id: "msg_001",
          threadId: "thread_001",
          dossierRef: "WF-001",
          sender: {
            id: "user_001",
            name: "Jean Martin",
            service: ServiceType.CONFIRMATION,
          },
          content: "Bonjour, le dossier de M. Dupont est prêt pour la visite technique. Merci de planifier un RDV.",
          timestamp: new Date(2024, 2, 15, 10, 30),
          readBy: ["user_001", "user_003"],
        },
        {
          id: "msg_002",
          threadId: "thread_001",
          dossierRef: "WF-001",
          sender: {
            id: "user_003",
            name: "Pierre Dupont",
            service: ServiceType.TECHNICAL_VISIT,
          },
          content: "Rendez-vous planifié pour le 20 mars à 14h. @Julie Moreau pouvez-vous le confirmer au client ?",
          timestamp: new Date(2024, 2, 16, 9, 15),
          readBy: ["user_001", "user_003", "user_006"],
          mentions: [
            {
              userId: "user_006",
              position: 42,
              length: 12,
              read: true,
            },
          ],
        },
        {
          id: "msg_003",
          threadId: "thread_001",
          dossierRef: "WF-001",
          sender: {
            id: "user_006",
            name: "Julie Moreau",
            service: ServiceType.MANAGEMENT,
          },
          content: "Confirmé avec le client par téléphone. Il sera présent.",
          timestamp: new Date(2024, 2, 16, 14, 45),
          readBy: ["user_006", "user_003"],
        },
      ],
      metadata: {
        totalMessages: 3,
        unreadMessages: {
          "user_001": 1,
          "user_003": 0,
          "user_004": 3,
          "user_006": 0,
        },
        lastActivity: new Date(2024, 2, 16, 14, 45),
      },
    };

    const thread2: MessageThread = {
      id: "thread_002",
      dossierRef: "WF-002",
      dossierTitle: "Isolation combles Mme Bernard",
      createdAt: new Date(2024, 2, 18),
      updatedAt: new Date(2024, 2, 19),
      participants: ["user_002", "user_004", "user_005"],
      messages: [
        {
          id: "msg_004",
          threadId: "thread_002",
          dossierRef: "WF-002",
          sender: {
            id: "user_002",
            name: "Marie Dubois",
            service: ServiceType.ADMINISTRATIVE,
          },
          content: "Le dossier de Mme Bernard nécessite une validation supplémentaire pour l'éligibilité MaPrimeRénov. @Thomas Leclerc peux-tu vérifier les plafonds de ressources ?",
          timestamp: new Date(2024, 2, 18, 11, 20),
          readBy: ["user_002", "user_005"],
          mentions: [
            {
              userId: "user_005",
              position: 101,
              length: 14,
              read: true,
            },
          ],
        },
        {
          id: "msg_005",
          threadId: "thread_002",
          dossierRef: "WF-002",
          sender: {
            id: "user_005",
            name: "Thomas Leclerc",
            service: ServiceType.BILLING,
          },
          content: "Vérification effectuée. Mme Bernard est bien éligible au taux maximum. Je joins l'attestation de revenus.",
          timestamp: new Date(2024, 2, 19, 9, 30),
          readBy: ["user_005"],
          attachments: [
            {
              id: "attach_001",
              name: "attestation_revenus_bernard.pdf",
              type: "document",
              size: "1.2 MB",
              url: "/documents/attestation_revenus_bernard.pdf",
              uploadedAt: new Date(2024, 2, 19, 9, 30),
              contentType: "application/pdf",
            },
          ],
        },
      ],
      metadata: {
        totalMessages: 2,
        unreadMessages: {
          "user_002": 1,
          "user_004": 2,
          "user_005": 0,
        },
        lastActivity: new Date(2024, 2, 19, 9, 30),
      },
    };

    this.mockThreads = [thread1, thread2];

    // Créer des notifications pour certains messages
    this.mockNotifications = [
      {
        id: "notif_001",
        userId: "user_006",
        messageId: "msg_002",
        threadId: "thread_001",
        dossierRef: "WF-001",
        type: "mention",
        read: true,
        timestamp: new Date(2024, 2, 16, 9, 15),
        content: "Pierre Dupont vous a mentionné dans un message.",
      },
      {
        id: "notif_002",
        userId: "user_005",
        messageId: "msg_004",
        threadId: "thread_002",
        dossierRef: "WF-002",
        type: "mention",
        read: true,
        timestamp: new Date(2024, 2, 18, 11, 20),
        content: "Marie Dubois vous a mentionné dans un message.",
      },
      {
        id: "notif_003",
        userId: "user_002",
        messageId: "msg_005",
        threadId: "thread_002",
        dossierRef: "WF-002",
        type: "new_message",
        read: false,
        timestamp: new Date(2024, 2, 19, 9, 30),
        content: "Nouveau message dans le dossier WF-002.",
      },
      {
        id: "notif_004",
        userId: "user_004",
        messageId: "msg_005",
        threadId: "thread_002",
        dossierRef: "WF-002",
        type: "attachment",
        read: false,
        timestamp: new Date(2024, 2, 19, 9, 30),
        content: "Thomas Leclerc a joint un document au dossier WF-002.",
      },
    ];
  }

  // Récupérer tous les fils de discussion
  async getAllThreads(): Promise<MessageThread[]> {
    return [...this.mockThreads];
  }

  // Récupérer un fil de discussion par ID
  async getThreadById(threadId: string): Promise<MessageThread | null> {
    const thread = this.mockThreads.find(t => t.id === threadId);
    return thread ? { ...thread } : null;
  }

  // Récupérer un fil de discussion par référence de dossier
  async getThreadByDossierRef(dossierRef: string): Promise<MessageThread | null> {
    const thread = this.mockThreads.find(t => t.dossierRef === dossierRef);
    return thread ? { ...thread } : null;
  }

  // Récupérer les fils de discussion auxquels un utilisateur participe
  async getThreadsByUserId(userId: string): Promise<MessageThread[]> {
    return this.mockThreads.filter(t => t.participants.includes(userId));
  }

  // Créer un nouveau fil de discussion
  async createThread(dossierRef: string, dossierTitle: string, participants: string[]): Promise<MessageThread> {
    const newThread: MessageThread = {
      id: `thread_${uuidv4()}`,
      dossierRef,
      dossierTitle,
      createdAt: new Date(),
      updatedAt: new Date(),
      participants,
      messages: [],
      metadata: {
        totalMessages: 0,
        unreadMessages: participants.reduce((acc, userId) => {
          acc[userId] = 0;
          return acc;
        }, {} as Record<string, number>),
        lastActivity: new Date(),
      },
    };

    this.mockThreads.push(newThread);
    return { ...newThread };
  }

  // Ajouter un message à un fil de discussion
  async addMessage(
    threadId: string,
    senderId: string,
    content: string,
    attachments: MessageAttachment[] = [],
    mentions: string[] = []
  ): Promise<Message | null> {
    const threadIndex = this.mockThreads.findIndex(t => t.id === threadId);
    if (threadIndex === -1) return null;

    const sender = this.mockUsers.find(u => u.id === senderId);
    if (!sender) return null;

    // Créer le nouveau message
    const newMessage: Message = {
      id: `msg_${uuidv4()}`,
      threadId,
      dossierRef: this.mockThreads[threadIndex].dossierRef,
      sender: {
        id: sender.id,
        name: sender.name,
        avatar: sender.avatar,
        service: sender.service,
      },
      content,
      timestamp: new Date(),
      readBy: [senderId],
      attachments,
      mentions: mentions.map(userId => ({
        userId,
        position: content.indexOf(`@${this.mockUsers.find(u => u.id === userId)?.name || ""}`) || 0,
        length: (this.mockUsers.find(u => u.id === userId)?.name.length || 0) + 1, // +1 pour le @
        read: false,
      })),
    };

    // Mettre à jour le fil de discussion
    this.mockThreads[threadIndex].messages.push(newMessage);
    this.mockThreads[threadIndex].updatedAt = new Date();

    // Mettre à jour les métadonnées
    if (this.mockThreads[threadIndex].metadata) {
      this.mockThreads[threadIndex].metadata.totalMessages += 1;
      this.mockThreads[threadIndex].metadata.lastActivity = new Date();

      // Incrémenter le compteur de messages non lus pour tous les participants sauf l'expéditeur
      this.mockThreads[threadIndex].participants.forEach(userId => {
        if (userId !== senderId && this.mockThreads[threadIndex].metadata) {
          this.mockThreads[threadIndex].metadata!.unreadMessages[userId] =
            (this.mockThreads[threadIndex].metadata!.unreadMessages[userId] || 0) + 1;
        }
      });
    }

    // Créer des notifications pour les mentions
    if (mentions.length > 0) {
      mentions.forEach(userId => {
        this.createNotification({
          userId,
          messageId: newMessage.id,
          threadId,
          dossierRef: this.mockThreads[threadIndex].dossierRef,
          type: 'mention',
          content: `${sender.name} vous a mentionné dans un message.`,
        });
      });
    }

    // Créer des notifications pour les nouveaux messages (sauf pour l'expéditeur)
    this.mockThreads[threadIndex].participants
      .filter(userId => userId !== senderId && !mentions.includes(userId))
      .forEach(userId => {
        this.createNotification({
          userId,
          messageId: newMessage.id,
          threadId,
          dossierRef: this.mockThreads[threadIndex].dossierRef,
          type: 'new_message',
          content: `Nouveau message dans le dossier ${this.mockThreads[threadIndex].dossierRef}.`,
        });
      });

    // Notifications pour les pièces jointes si présentes
    if (attachments.length > 0) {
      this.mockThreads[threadIndex].participants
        .filter(userId => userId !== senderId)
        .forEach(userId => {
          this.createNotification({
            userId,
            messageId: newMessage.id,
            threadId,
            dossierRef: this.mockThreads[threadIndex].dossierRef,
            type: 'attachment',
            content: `${sender.name} a joint un document au dossier ${this.mockThreads[threadIndex].dossierRef}.`,
          });
        });
    }

    return { ...newMessage };
  }

  // Marquer un message comme lu pour un utilisateur
  async markMessageAsRead(messageId: string, userId: string): Promise<boolean> {
    // Trouver le fil et le message
    for (const thread of this.mockThreads) {
      const message = thread.messages.find(m => m.id === messageId);
      if (message) {
        // Vérifier si l'utilisateur a déjà lu le message
        if (!message.readBy.includes(userId)) {
          message.readBy.push(userId);

          // Mettre à jour le compteur de messages non lus
          if (thread.metadata && thread.metadata.unreadMessages[userId] > 0) {
            thread.metadata.unreadMessages[userId] -= 1;
          }

          // Marquer les mentions comme lues
          if (message.mentions) {
            message.mentions.forEach(mention => {
              if (mention.userId === userId) {
                mention.read = true;
              }
            });
          }

          // Marquer les notifications comme lues
          this.mockNotifications
            .filter(n => n.messageId === messageId && n.userId === userId)
            .forEach(n => { n.read = true; });

          return true;
        }
        return true; // Le message est déjà marqué comme lu
      }
    }
    return false; // Message non trouvé
  }

  // Marquer tous les messages d'un fil comme lus pour un utilisateur
  async markThreadAsRead(threadId: string, userId: string): Promise<boolean> {
    const thread = this.mockThreads.find(t => t.id === threadId);
    if (!thread) return false;

    let updated = false;

    // Marquer chaque message comme lu
    thread.messages.forEach(message => {
      if (!message.readBy.includes(userId)) {
        message.readBy.push(userId);
        updated = true;

        // Marquer les mentions comme lues
        if (message.mentions) {
          message.mentions.forEach(mention => {
            if (mention.userId === userId) {
              mention.read = true;
            }
          });
        }
      }
    });

    // Réinitialiser le compteur de messages non lus
    if (thread.metadata) {
      thread.metadata.unreadMessages[userId] = 0;
    }

    // Marquer les notifications comme lues
    this.mockNotifications
      .filter(n => n.threadId === threadId && n.userId === userId)
      .forEach(n => { n.read = true; });

    return updated;
  }

  // Récupérer les notifications non lues pour un utilisateur
  async getUnreadNotifications(userId: string): Promise<MessageNotification[]> {
    return this.mockNotifications.filter(n => n.userId === userId && !n.read);
  }

  // Créer une nouvelle notification
  private createNotification(data: {
    userId: string;
    messageId: string;
    threadId: string;
    dossierRef: string;
    type: 'new_message' | 'mention' | 'attachment' | 'thread_update';
    content: string;
  }): MessageNotification {
    const notification: MessageNotification = {
      id: `notif_${uuidv4()}`,
      userId: data.userId,
      messageId: data.messageId,
      threadId: data.threadId,
      dossierRef: data.dossierRef,
      type: data.type,
      read: false,
      timestamp: new Date(),
      content: data.content,
    };

    this.mockNotifications.push(notification);
    return notification;
  }

  // Récupérer la liste des utilisateurs disponibles
  async getAvailableUsers(): Promise<MessageUser[]> {
    return [...this.mockUsers];
  }

  // Rechercher des messages contenant un texte spécifique
  async searchMessages(query: string): Promise<Message[]> {
    const results: Message[] = [];
    for (const thread of this.mockThreads) {
      const matchingMessages = thread.messages.filter(
        m => m.content.toLowerCase().includes(query.toLowerCase())
      );
      results.push(...matchingMessages);
    }
    return results;
  }
}
