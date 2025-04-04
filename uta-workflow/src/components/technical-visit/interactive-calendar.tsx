"use client";

import type React from "react";
import { useState, useMemo, useCallback } from "react";
import { Calendar, Views } from "react-big-calendar";
import { format, parse, addHours } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Info, Calendar as CalendarIcon, Clock, MapPin, User, Edit, Trash2 } from "lucide-react";
import { dateFnsLocalizer } from "@/lib/calendar-localizer";
import AddressVerification from "@/components/AddressVerification"; // Importation du composant AddressVerification

// Importation des styles
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "@/styles/calendar.css"; // Ajout de notre CSS personnalisé

// Définition des messages en français pour le calendrier
const messages = {
  allDay: "Journée",
  previous: "Précédent",
  next: "Suivant",
  today: "Aujourd'hui",
  month: "Mois",
  week: "Semaine",
  day: "Jour",
  agenda: "Agenda",
  date: "Date",
  time: "Heure",
  event: "Événement",
  noEventsInRange: "Aucun événement dans cette période",
  showMore: (total: number) => `+ ${total} événement(s) supplémentaire(s)`,
};

// Pour la compatibilité avec date-fns
const localizer = dateFnsLocalizer;

// Types pour les événements du calendrier
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    client: {
      id: string;
      name: string;
      address: string;
      postalCode?: string; // Ajout du code postal
      city?: string; // Ajout de la ville
      phone?: string;
      email?: string;
      propertyType?: string;
      propertySize?: string;
      renovationType?: string;
      coordinates?: { lat: number; lng: number }; // Ajout des coordonnées
    };
    status: 'pending' | 'completed' | 'rescheduled' | 'cancelled';
    notes?: string;
  };
}

interface InteractiveCalendarProps {
  events: CalendarEvent[];
  onEventAdd?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  onEventSelect?: (event: CalendarEvent) => void;
  readOnly?: boolean;
}

export function InteractiveCalendar({
  events,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  onEventSelect,
  readOnly = false,
}: InteractiveCalendarProps) {
  const [currentView, setCurrentView] = useState("month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: "",
    start: new Date(),
    end: addHours(new Date(), 1),
    resource: {
      client: {
        id: "",
        name: "",
        address: "",
      },
      status: "pending",
    },
  });

  // Style pour les événements basé sur leur statut
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const style: React.CSSProperties = {
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0',
      display: 'block',
    };

    if (event.resource?.status === 'completed') {
      style.backgroundColor = '#22c55e'; // green-500
    } else if (event.resource?.status === 'pending') {
      style.backgroundColor = '#eab308'; // yellow-500
    } else if (event.resource?.status === 'rescheduled') {
      style.backgroundColor = '#3b82f6'; // blue-500
    } else if (event.resource?.status === 'cancelled') {
      style.backgroundColor = '#ef4444'; // red-500
    }

    return { style };
  }, []);

  // Formatage des dates pour l'affichage dans le calendrier
  const formats = useMemo(() => ({
    timeGutterFormat: (date: Date) => format(date, 'HH:mm', { locale: fr }),
    eventTimeRangeFormat: ({ start, end }: { start: Date, end: Date }) => {
      return `${format(start, 'HH:mm', { locale: fr })} - ${format(end, 'HH:mm', { locale: fr })}`;
    },
    dayHeaderFormat: (date: Date) => format(date, 'EEEE dd MMMM', { locale: fr }),
    dayRangeHeaderFormat: ({ start, end }: { start: Date, end: Date }) => {
      return `${format(start, 'dd MMM', { locale: fr })} - ${format(end, 'dd MMM', { locale: fr })}`;
    },
  }), []);

  // Gestionnaire pour le clic sur un créneau horaire (pour ajouter un événement)
  const handleSelectSlot = useCallback(({ start, end }: { start: Date, end: Date }) => {
    if (readOnly) return;

    setNewEvent({
      title: "",
      start,
      end,
      resource: {
        client: {
          id: "",
          name: "",
          address: "",
        },
        status: "pending",
      },
    });

    setShowEventDialog(true);
  }, [readOnly]);

  // Gestionnaire pour le clic sur un événement (pour afficher les détails)
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowDetailsDialog(true);
    if (onEventSelect) onEventSelect(event);
  }, [onEventSelect]);

  // Gestionnaire pour la création d'un nouvel événement
  const handleCreateEvent = useCallback(() => {
    if (!newEvent.title || !newEvent.start || !newEvent.end || !newEvent.resource?.client.name) {
      // Validation simple
      return;
    }

    const eventToAdd = {
      ...newEvent,
      id: `event-${Date.now()}`, // Génération d'un ID unique
    } as CalendarEvent;

    if (onEventAdd) onEventAdd(eventToAdd);
    setShowEventDialog(false);
    setNewEvent({
      title: "",
      start: new Date(),
      end: addHours(new Date(), 1),
      resource: {
        client: {
          id: "",
          name: "",
          address: "",
        },
        status: "pending",
      },
    });
  }, [newEvent, onEventAdd]);

  // Gestionnaire pour la suppression d'un événement
  const handleDeleteEvent = useCallback(() => {
    if (selectedEvent && onEventDelete) {
      onEventDelete(selectedEvent.id);
      setShowDetailsDialog(false);
      setSelectedEvent(null);
    }
  }, [selectedEvent, onEventDelete]);

  return (
    <>
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Calendrier des rendez-vous</CardTitle>
          <CardDescription>
            Visualisez et gérez tous vos rendez-vous de visite technique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[700px] mt-4">
            <Calendar
              localizer={localizer as any}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              messages={messages}
              defaultView={Views.MONTH}
              views={['month', 'week', 'day', 'agenda']}
              onView={(view) => setCurrentView(view)}
              date={selectedDate}
              onNavigate={setSelectedDate}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable={!readOnly}
              formats={formats}
              step={30}
              timeslots={1}
              tooltipAccessor={(event: CalendarEvent) => `${event.title} - ${event.resource?.client.address || ''}`}
              className="bg-gray-800 p-4 rounded-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Dialogue pour créer/modifier un événement */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter un rendez-vous</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouveau rendez-vous.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du rendez-vous</Label>
              <Input
                id="title"
                value={newEvent.title || ""}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                className="bg-gray-800 border-gray-700"
                placeholder="Visite technique - Isolation"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Date de début</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={newEvent.start ? format(newEvent.start, 'yyyy-MM-dd') : ""}
                  onChange={(e) => {
                    const date = parse(e.target.value, 'yyyy-MM-dd', new Date());
                    const newStart = new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate(),
                      newEvent.start ? newEvent.start.getHours() : new Date().getHours(),
                      newEvent.start ? newEvent.start.getMinutes() : new Date().getMinutes()
                    );
                    setNewEvent({...newEvent, start: newStart});
                  }}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-time">Heure de début</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={newEvent.start ? format(newEvent.start, 'HH:mm') : ""}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    const newStart = new Date(newEvent.start || new Date());
                    newStart.setHours(hours);
                    newStart.setMinutes(minutes);
                    setNewEvent({...newEvent, start: newStart});
                  }}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">Date de fin</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={newEvent.end ? format(newEvent.end, 'yyyy-MM-dd') : ""}
                  onChange={(e) => {
                    const date = parse(e.target.value, 'yyyy-MM-dd', new Date());
                    const newEnd = new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate(),
                      newEvent.end ? newEvent.end.getHours() : new Date().getHours() + 1,
                      newEvent.end ? newEvent.end.getMinutes() : new Date().getMinutes()
                    );
                    setNewEvent({...newEvent, end: newEnd});
                  }}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">Heure de fin</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={newEvent.end ? format(newEvent.end, 'HH:mm') : ""}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    const newEnd = new Date(newEvent.end || addHours(new Date(), 1));
                    newEnd.setHours(hours);
                    newEnd.setMinutes(minutes);
                    setNewEvent({...newEvent, end: newEnd});
                  }}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-name">Nom du client</Label>
              <Input
                id="client-name"
                value={newEvent.resource?.client.name || ""}
                onChange={(e) => setNewEvent({
                  ...newEvent,
                  resource: {
                    ...newEvent.resource!,
                    client: {
                      ...newEvent.resource!.client,
                      name: e.target.value
                    }
                  }
                })}
                className="bg-gray-800 border-gray-700"
                placeholder="Jean Dupont"
              />
            </div>

            {/* AddressVerification component pour l'adresse */}
            <AddressVerification
              initialAddress={newEvent.resource?.client.address || ""}
              onAddressSelect={(addressData) => {
                setNewEvent({
                  ...newEvent,
                  resource: {
                    ...newEvent.resource!,
                    client: {
                      ...newEvent.resource!.client,
                      address: addressData.formattedAddress,
                      postalCode: addressData.postalCode,
                      city: addressData.city,
                      coordinates: addressData.coordinates,
                    }
                  }
                });
              }}
              required={true}
              label="Adresse du client"
              description="Entrez l'adresse et sélectionnez la suggestion correcte pour confirmer la localisation exacte"
            />

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                defaultValue={newEvent.resource?.status}
                onValueChange={(value) => setNewEvent({
                  ...newEvent,
                  resource: {
                    ...newEvent.resource!,
                    status: value as 'pending' | 'completed' | 'rescheduled' | 'cancelled'
                  }
                })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700" id="status">
                  <SelectValue placeholder="Sélectionnez un statut" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="rescheduled">Reporté</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newEvent.resource?.notes || ""}
                onChange={(e) => setNewEvent({
                  ...newEvent,
                  resource: {
                    ...newEvent.resource!,
                    notes: e.target.value
                  }
                })}
                className="bg-gray-800 border-gray-700"
                placeholder="Informations supplémentaires pour ce rendez-vous..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEventDialog(false)}
            >
              Annuler
            </Button>
            <Button type="button" onClick={handleCreateEvent}>
              Créer le rendez-vous
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue pour afficher les détails d'un événement */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails du rendez-vous</DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                <Badge
                  className={cn(
                    selectedEvent.resource?.status === 'completed' && "bg-green-500/20 text-green-500 border-green-900/50",
                    selectedEvent.resource?.status === 'pending' && "bg-yellow-500/20 text-yellow-500 border-yellow-900/50",
                    selectedEvent.resource?.status === 'rescheduled' && "bg-blue-500/20 text-blue-500 border-blue-900/50",
                    selectedEvent.resource?.status === 'cancelled' && "bg-red-500/20 text-red-500 border-red-900/50",
                  )}
                >
                  {selectedEvent.resource?.status === 'completed' && "Terminé"}
                  {selectedEvent.resource?.status === 'pending' && "En attente"}
                  {selectedEvent.resource?.status === 'rescheduled' && "Reporté"}
                  {selectedEvent.resource?.status === 'cancelled' && "Annulé"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <span>
                    {format(selectedEvent.start, 'EEEE dd MMMM yyyy', { locale: fr })}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span>
                    {format(selectedEvent.start, 'HH:mm', { locale: fr })} - {format(selectedEvent.end, 'HH:mm', { locale: fr })}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-800 rounded-md space-y-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">{selectedEvent.resource?.client.name}</span>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                  <span>{selectedEvent.resource?.client.address}</span>
                </div>

                {selectedEvent.resource?.client.propertyType && (
                  <div className="flex items-start">
                    <span className="text-sm text-gray-400 mr-2">Type:</span>
                    <span>{selectedEvent.resource.client.propertyType} - {selectedEvent.resource.client.propertySize}m²</span>
                  </div>
                )}

                {selectedEvent.resource?.client.renovationType && (
                  <div className="flex items-start">
                    <span className="text-sm text-gray-400 mr-2">Rénovation:</span>
                    <span>{selectedEvent.resource.client.renovationType}</span>
                  </div>
                )}
              </div>

              {selectedEvent.resource?.notes && (
                <div className="space-y-1">
                  <h4 className="text-sm font-medium flex items-center">
                    <Info className="h-4 w-4 mr-1 text-gray-400" />
                    Notes
                  </h4>
                  <p className="text-sm bg-gray-800 p-3 rounded-md">{selectedEvent.resource.notes}</p>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  className="text-red-500 hover:text-red-400"
                  onClick={handleDeleteEvent}
                  disabled={readOnly}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>

                <div className="space-x-2">
                  <Button asChild variant="outline">
                    <Link href={`/technical-visit/appointments`}>
                      Voir tous les rendez-vous
                    </Link>
                  </Button>

                  <Button asChild>
                    <Link href={`/technical-visit/appointment/${selectedEvent.id}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Questionnaire
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
