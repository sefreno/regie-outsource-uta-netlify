"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InteractiveCalendar } from "@/components/technical-visit/interactive-calendar";
import { appointmentsToCalendarEvents, parseAppointmentDateTime } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilter, Calendar, List } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Données fictives pour les rendez-vous
const MOCK_APPOINTMENTS = [
  {
    id: "TV001",
    client: {
      id: "C12345",
      name: "Jean Dupont",
      address: "123 Rue de la Paix, 75001 Paris",
      phone: "06 12 34 56 78",
      email: "jean.dupont@example.com",
      propertyType: "Appartement",
      propertySize: "80",
      renovationType: "Isolation des murs",
      administrativeNotes: "Client pressé, souhaite commencer les travaux dès que possible. Dossier prioritaire.",
    },
    date: "2023-04-25",
    time: "10:00",
    status: "pending" as const,
  },
  {
    id: "TV002",
    client: {
      id: "C12346",
      name: "Marie Lambert",
      address: "45 Avenue des Fleurs, 69002 Lyon",
      phone: "06 23 45 67 89",
      email: "marie.lambert@example.com",
      propertyType: "Maison",
      propertySize: "120",
      renovationType: "Pompe à chaleur",
      administrativeNotes: "Bénéficie de MaPrimeRénov. Prendre des photos du jardin pour l'emplacement de l'unité extérieure.",
    },
    date: "2023-04-26",
    time: "14:30",
    status: "pending" as const,
  },
  {
    id: "TV003",
    client: {
      id: "C12347",
      name: "Sophie Dubois",
      address: "12 Rue du Faubourg, 31000 Toulouse",
      phone: "06 34 56 78 90",
      email: "sophie.dubois@example.com",
      propertyType: "Appartement",
      propertySize: "65",
      renovationType: "Fenêtres double vitrage",
      administrativeNotes: "",
    },
    date: "2023-04-24",
    time: "09:00",
    status: "completed" as const,
  },
  {
    id: "TV004",
    client: {
      id: "C12348",
      name: "Thomas Bernard",
      address: "3 Place de la République, 44000 Nantes",
      phone: "06 45 67 89 01",
      email: "thomas.bernard@example.com",
      propertyType: "Maison",
      propertySize: "150",
      renovationType: "Isolation des combles",
      administrativeNotes: "Accès aux combles difficile, prévoir échelle. Prévoir caméra thermique.",
    },
    date: "2023-04-27",
    time: "11:00",
    status: "pending" as const,
  },
  {
    id: "TV005",
    client: {
      id: "C12349",
      name: "Paul Martin",
      address: "8 Boulevard Haussman, 75008 Paris",
      phone: "06 56 78 90 12",
      email: "paul.martin@example.com",
      propertyType: "Appartement",
      propertySize: "95",
      renovationType: "Chaudière à condensation",
      administrativeNotes: "Immeuble haussmannien, vérifier compatibilité des conduits existants.",
    },
    date: "2023-04-23",
    time: "15:00",
    status: "rescheduled" as const,
  },
];

// Ajoutons plus de rendez-vous pour les prochains mois (pour avoir une meilleure visualisation)
const ADDITIONAL_APPOINTMENTS = [
  {
    id: "TV006",
    client: {
      id: "C12350",
      name: "Lucie Moreau",
      address: "56 Avenue Victor Hugo, 75016 Paris",
      phone: "06 67 89 01 23",
      email: "lucie.moreau@example.com",
      propertyType: "Appartement",
      propertySize: "75",
      renovationType: "Isolation thermique",
      administrativeNotes: "Appartement haussmannien, plafonds hauts.",
    },
    date: "2023-05-02",
    time: "11:30",
    status: "pending" as const,
  },
  {
    id: "TV007",
    client: {
      id: "C12351",
      name: "Marc Dubois",
      address: "12 Rue des Lilas, 59000 Lille",
      phone: "06 78 90 12 34",
      email: "marc.dubois@example.com",
      propertyType: "Maison",
      propertySize: "130",
      renovationType: "Panneaux solaires",
      administrativeNotes: "Orientation sud parfaite pour les panneaux. Toiture récente.",
    },
    date: "2023-05-05",
    time: "14:00",
    status: "pending" as const,
  },
  {
    id: "TV008",
    client: {
      id: "C12352",
      name: "Émilie Petit",
      address: "8 Place Bellecour, 69002 Lyon",
      phone: "06 89 01 23 45",
      email: "emilie.petit@example.com",
      propertyType: "Appartement",
      propertySize: "90",
      renovationType: "Ventilation double flux",
      administrativeNotes: "",
    },
    date: "2023-05-10",
    time: "09:30",
    status: "pending" as const,
  },
];

export default function TechnicalVisitCalendarPage() {
  const [appointments, setAppointments] = useState([...MOCK_APPOINTMENTS, ...ADDITIONAL_APPOINTMENTS]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [currentView, setCurrentView] = useState<"calendar" | "list">("calendar");

  // Convertir les rendez-vous en événements de calendrier
  useEffect(() => {
    const events = appointmentsToCalendarEvents(appointments);
    setCalendarEvents(events);
  }, [appointments]);

  // Ajouter un nouveau rendez-vous
  const handleAddEvent = (event: any) => {
    // Créer un nouvel ID unique pour le rendez-vous
    const newAppointmentId = `TV${String(appointments.length + 1).padStart(3, '0')}`;

    // Créer un nouvel objet de rendez-vous à partir de l'événement
    const newAppointment = {
      id: newAppointmentId,
      client: {
        id: `C${Math.floor(10000 + Math.random() * 90000)}`, // ID client aléatoire
        name: event.resource.client.name,
        address: event.resource.client.address,
        phone: event.resource.client.phone || "",
        email: event.resource.client.email || "",
        propertyType: event.resource.client.propertyType || "",
        propertySize: event.resource.client.propertySize || "",
        renovationType: event.resource.client.renovationType || "",
        administrativeNotes: event.resource.notes || "",
      },
      date: event.start.toISOString().split('T')[0],
      time: `${String(event.start.getHours()).padStart(2, '0')}:${String(event.start.getMinutes()).padStart(2, '0')}`,
      status: event.resource.status,
    };

    // Mettre à jour l'état des rendez-vous
    setAppointments([...appointments, newAppointment]);

    // Mettre à jour l'état des événements du calendrier
    setCalendarEvents([...calendarEvents, event]);
  };

  // Supprimer un événement du calendrier
  const handleDeleteEvent = (eventId: string) => {
    // Supprimer le rendez-vous
    setAppointments(appointments.filter(a => a.id !== eventId));

    // Supprimer l'événement du calendrier
    setCalendarEvents(calendarEvents.filter(e => e.id !== eventId));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Calendrier des visites techniques</h1>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="button-highlight"
                  asChild
                >
                  <Link href="/technical-visit/appointments">
                    <List className="h-4 w-4 mr-1" />
                    Vue liste
                  </Link>
                </Button>
                <Button
                  variant="default"
                  className="button-highlight"
                  asChild
                >
                  <Link href="/technical-visit/dashboard">
                    Tableau de bord
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <ListFilter className="h-4 w-4 text-gray-400" />
              <span className="text-sm">Affichage:</span>
              <Tabs
                value={currentView}
                onValueChange={(value) => setCurrentView(value as "calendar" | "list")}
                className="w-[200px]"
              >
                <TabsList className="bg-gray-800 border-gray-700">
                  <TabsTrigger value="calendar" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Calendrier
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center">
                    <List className="h-4 w-4 mr-1" />
                    Liste
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex-1 text-right">
                <span className="text-sm text-gray-400">Cliquez sur une plage horaire pour créer un nouveau rendez-vous</span>
              </div>
            </div>

            <Separator />

            <TabsContent value="calendar" className="mt-4 p-0" forceMount={currentView === "calendar"}>
              <InteractiveCalendar
                events={calendarEvents}
                onEventAdd={handleAddEvent}
                onEventDelete={handleDeleteEvent}
              />
            </TabsContent>

            <TabsContent value="list" className="mt-0 p-0" forceMount={currentView === "list"}>
              <Link href="/technical-visit/appointments">
                <Button className="w-full py-10 text-xl">
                  Ouvrir la vue liste des rendez-vous
                </Button>
              </Link>
            </TabsContent>
          </div>
        </main>
      </div>
    </div>
  );
}
