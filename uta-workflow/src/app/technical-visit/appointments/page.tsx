"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AppointmentCard } from "@/components/technical-visit/appointment-card";
import {
  Calendar,
  List,
  Search,
  Filter,
  ArrowUpDown,
  CalendarDays,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function TechnicalVisitAppointmentsPage() {
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [viewType, setViewType] = useState<"list" | "calendar">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fonction pour gérer le replanification d'un rendez-vous
  const handleReschedule = (id: string, newDate: string, newTime: string) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              date: newDate,
              time: newTime,
              status: "rescheduled" as const,
            }
          : appointment
      )
    );
  };

  // Filtrer les rendez-vous
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.client.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Trier les rendez-vous
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);

    return sortOrder === "asc"
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Rendez-vous de visite technique</h1>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="button-highlight flex items-center"
                  asChild
                >
                  <Link href="/technical-visit/calendar">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Vue calendrier
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

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative w-full md:w-auto flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom, adresse ou ID..."
                  className="pl-10 bg-gray-800 border-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <div className="flex items-center space-x-2">
                  <Filter className="text-gray-400 h-4 w-4" />
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 w-[140px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="completed">Terminés</SelectItem>
                      <SelectItem value="rescheduled">Reportés</SelectItem>
                      <SelectItem value="cancelled">Annulés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="text-gray-400 h-4 w-4" />
                  <Select
                    value={sortOrder}
                    onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 w-[140px]">
                      <SelectValue placeholder="Trier" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="asc">Plus proches</SelectItem>
                      <SelectItem value="desc">Plus lointains</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Tabs
                  value={viewType}
                  onValueChange={(value) => setViewType(value as "list" | "calendar")}
                  className="w-[140px]"
                >
                  <TabsList className="bg-gray-800 border-gray-700">
                    <TabsTrigger value="list" className="flex items-center">
                      <List className="h-4 w-4 mr-1" />
                      Liste
                    </TabsTrigger>
                    <TabsTrigger value="calendar" className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      Agenda
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <Separator />

            {viewType === "list" ? (
              <div className="grid gap-4">
                {sortedAppointments.length > 0 ? (
                  sortedAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      id={appointment.id}
                      client={appointment.client}
                      date={appointment.date}
                      time={appointment.time}
                      status={appointment.status}
                      onReschedule={handleReschedule}
                    />
                  ))
                ) : (
                  <div className="text-center p-10 border border-dashed border-gray-700 rounded-lg">
                    <Calendar className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                    <h3 className="font-medium">Aucun rendez-vous trouvé</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Essayez de modifier vos filtres ou votre recherche
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-10 border border-dashed border-gray-700 rounded-lg">
                <CalendarDays className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                <h3 className="font-medium">Vue calendrier</h3>
                <p className="text-sm text-gray-400 mt-1">
                  La vue calendrier sera disponible prochainement
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
