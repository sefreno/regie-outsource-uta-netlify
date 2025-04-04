/**
 * Modèles de données pour le système de messagerie entre services
 */

// Types de services disponibles dans l'application
export enum ServiceType {
  CONFIRMATION = "confirmation",
  ADMINISTRATIVE = "administrative",
  TECHNICAL_VISIT = "technical-visit",
  INSTALLATION = "installation",
  BILLING = "billing",
  MANAGEMENT = "management",
}

// Interface pour un utilisateur du système de messagerie
export interface MessageUser {
  id: string;
  name: string;
  email: string;
  service: ServiceType;
  avatar?: string;
  role: string;
}

// Interface pour une pièce jointe dans un message
export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  uploadedAt: Date;
  contentType: string;
}

// Interface pour une mention dans un message
export interface MessageMention {
  userId: string;
  position: number; // Position dans le texte
  length: number;   // Longueur de la mention
  read: boolean;    // Si la mention a été vue par l'utilisateur mentionné
}

// Interface pour un message
export interface Message {
  id: string;
  threadId: string;    // ID du fil de discussion (lié au dossier)
  dossierRef: string;  // Référence du dossier concerné
  sender: {
    id: string;
    name: string;
    avatar?: string;
    service: ServiceType;
  };
  content: string;
  timestamp: Date;
  attachments?: MessageAttachment[];
  mentions?: MessageMention[];
  readBy: string[];    // IDs des utilisateurs qui ont lu le message
}

// Interface pour un fil de discussion
export interface MessageThread {
  id: string;
  dossierRef: string;  // Référence du dossier concerné
  dossierTitle: string;
  createdAt: Date;
  updatedAt: Date;
  participants: string[]; // IDs des utilisateurs participants
  messages: Message[];
  metadata?: {
    totalMessages: number;
    unreadMessages: Record<string, number>; // Par utilisateur
    lastActivity: Date;
  };
}

// Interface pour des notifications liées aux messages
export interface MessageNotification {
  id: string;
  userId: string;
  messageId: string;
  threadId: string;
  dossierRef: string;
  type: 'new_message' | 'mention' | 'attachment' | 'thread_update';
  read: boolean;
  timestamp: Date;
  content: string;
}

// Interface pour les préférences de notification d'un utilisateur
export interface NotificationPreferences {
  userId: string;
  subscribedThreads: string[]; // IDs des fils auxquels l'utilisateur est abonné
  mentionsOnly: boolean; // Si true, ne notifier que les mentions explicites
  emailNotifications: boolean;
  desktopNotifications: boolean;
  muteAll: boolean;
}
