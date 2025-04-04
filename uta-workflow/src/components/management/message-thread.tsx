"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Send,
  Paperclip,
  Plus,
  Eye,
  Download,
  ChevronDown,
  AtSign,
  Bell,
  BellOff
} from "lucide-react";

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    service: string;
  };
  content: string;
  timestamp: Date;
  attachments?: {
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
  }[];
  mentions?: string[];
  isUnread?: boolean;
}

interface MessageThreadProps {
  dossierRef: string;
  dossierTitle: string;
  messages: Message[];
  onSendMessage: (content: string, attachments: File[], mentions: string[]) => void;
  onMarkAsRead?: (messageId: string) => void;
  availableUsers: Array<{ id: string; name: string; service: string }>;
}

export function MessageThread({
  dossierRef,
  dossierTitle,
  messages,
  onSendMessage,
  onMarkAsRead,
  availableUsers
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);
  const [isMentioning, setIsMentioning] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [showMentionList, setShowMentionList] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(true);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Défilement automatique vers le bas lors du chargement ou de l'ajout de nouveaux messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() || attachments.length > 0) {
      onSendMessage(newMessage, attachments, mentions);
      setNewMessage("");
      setAttachments([]);
      setMentions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Envoi avec Ctrl+Enter
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSendMessage();
    }

    // Gestion des mentions avec @
    if (e.key === "@") {
      setIsMentioning(true);
      setShowMentionList(true);
      setMentionFilter("");
    }

    // Navigation dans la liste des mentions
    if (showMentionList) {
      if (e.key === "Escape") {
        setShowMentionList(false);
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault(); // Empêcher le défilement du textarea
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (isMentioning) {
      if (e.key === " " || e.key === "Escape") {
        setIsMentioning(false);
        setShowMentionList(false);
      } else {
        // Extraire le texte après le @ pour filtrer les mentions
        const text = (e.target as HTMLTextAreaElement).value;
        const lastAtIndex = text.lastIndexOf("@");
        if (lastAtIndex >= 0) {
          const filterText = text.substring(lastAtIndex + 1).split(" ")[0];
          setMentionFilter(filterText);
        }
      }
    }
  };

  const handleSelectMention = (userId: string, userName: string) => {
    if (!mentions.includes(userId)) {
      setMentions([...mentions, userId]);
    }

    // Remplacer le @ et le texte de filtre par le nom de l'utilisateur
    const text = newMessage;
    const lastAtIndex = text.lastIndexOf("@");
    if (lastAtIndex >= 0) {
      const newText = text.substring(0, lastAtIndex) + `@${userName} `;
      setNewMessage(newText);
      setIsMentioning(false);
      setShowMentionList(false);
      messageInputRef.current?.focus();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatMessageDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  };

  const getServiceColor = (service: string) => {
    const serviceColors: Record<string, string> = {
      'confirmation': 'bg-blue-500',
      'administrative': 'bg-purple-500',
      'technical-visit': 'bg-yellow-500',
      'installation': 'bg-green-500',
      'billing': 'bg-rose-500',
      'management': 'bg-indigo-500',
    };
    return serviceColors[service] || 'bg-gray-500';
  };

  // Filtrer les utilisateurs pour les mentions
  const filteredUsers = availableUsers.filter(user =>
    mentionFilter === "" || user.name.toLowerCase().includes(mentionFilter.toLowerCase())
  );

  return (
    <Card className="border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">
          Messages du dossier {dossierRef}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSubscribed(!isSubscribed)}
          className="h-8 px-2"
        >
          {isSubscribed ? (
            <>
              <Bell className="h-4 w-4 mr-2" />
              Abonné
            </>
          ) : (
            <>
              <BellOff className="h-4 w-4 mr-2" />
              Non abonné
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {/* Zone des messages */}
        <div className="h-96 overflow-y-auto mb-4 pr-2">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <div className="mb-2">
                <AtSign className="h-8 w-8 mb-2 mx-auto" />
                <p>Aucun message pour ce dossier</p>
              </div>
              <p className="text-sm max-w-md">
                Les messages permettent de communiquer entre services à propos de ce dossier.
                Mentionnez un collègue avec @ pour attirer son attention.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={message.id} className={`flex ${message.isUnread ? 'bg-primary/5 p-2 rounded-md -mx-2' : ''}`}>
                  {/* Avatar */}
                  <Avatar className="h-8 w-8 mr-3 mt-1">
                    {message.sender.avatar ? (
                      <img src={message.sender.avatar} alt={message.sender.name} />
                    ) : (
                      <div className={`h-full w-full flex items-center justify-center text-primary-foreground ${getServiceColor(message.sender.service)}`}>
                        {message.sender.name.charAt(0)}
                      </div>
                    )}
                  </Avatar>

                  {/* Contenu du message */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{message.sender.name}</span>
                      <Badge
                        variant="outline"
                        className="text-xs py-0 h-5"
                      >
                        {message.sender.service}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {formatMessageDate(message.timestamp)}
                      </span>
                    </div>

                    <div className="mt-1 text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>

                    {/* Pièces jointes */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map(attachment => (
                          <div
                            key={attachment.id}
                            className="flex items-center p-2 rounded-md bg-gray-800/50 text-sm"
                          >
                            <div className="flex-1">
                              <div className="font-medium">{attachment.name}</div>
                              <div className="text-xs text-gray-400">{attachment.size}</div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bouton "Marquer comme lu" pour les messages non lus */}
                    {message.isUnread && onMarkAsRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-7 text-xs"
                        onClick={() => onMarkAsRead(message.id)}
                      >
                        Marquer comme lu
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={endOfMessagesRef} />
            </div>
          )}
        </div>

        <Separator className="my-4" />

        {/* Zone de composition de message */}
        <div>
          {/* Pièces jointes en cours d'ajout */}
          {attachments.length > 0 && (
            <div className="mb-3 space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 rounded-md bg-gray-800/50 text-sm"
                >
                  <div className="flex-1">
                    <div className="font-medium">{file.name}</div>
                    <div className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => removeAttachment(index)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Zone de texte et contrôles */}
          <div className="relative">
            <Textarea
              ref={messageInputRef}
              placeholder="Écrivez votre message... Utilisez @ pour mentionner un collègue"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              className="min-h-24 pr-12 resize-none"
            />

            {/* Bouton d'envoi */}
            <Button
              className="absolute right-2 bottom-2"
              size="icon"
              onClick={handleSendMessage}
            >
              <Send className="h-4 w-4" />
            </Button>

            {/* Bouton d'ajout de pièce jointe */}
            <Button
              className="absolute right-2 top-2"
              size="icon"
              variant="ghost"
              onClick={triggerFileInput}
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            {/* Input file caché */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              onChange={handleFileUpload}
            />

            {/* Liste de suggestions de mentions */}
            {showMentionList && filteredUsers.length > 0 && (
              <div className="absolute bottom-full left-0 mb-1 bg-gray-900 border border-gray-800 rounded-md shadow-lg z-10 w-64 max-h-56 overflow-y-auto">
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    className="px-3 py-2 hover:bg-gray-800 flex items-center cursor-pointer"
                    onClick={() => handleSelectMention(user.id, user.name)}
                  >
                    <Avatar className="h-6 w-6 mr-2">
                      <div className={`h-full w-full flex items-center justify-center text-primary-foreground ${getServiceColor(user.service)}`}>
                        {user.name.charAt(0)}
                      </div>
                    </Avatar>
                    <span>{user.name}</span>
                    <Badge variant="outline" className="ml-2 text-xs py-0">{user.service}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between mt-2">
            <div className="text-xs text-gray-400">
              Utilisez Ctrl+Entrée pour envoyer
            </div>
            <div className="text-xs">
              <Button variant="ghost" size="sm" className="h-6 px-2" onClick={triggerFileInput}>
                <Plus className="h-3 w-3 mr-1" />
                Ajouter un fichier
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
