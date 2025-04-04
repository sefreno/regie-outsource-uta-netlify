"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { FeasibilityQuestionnaire } from "@/components/technical-visit/feasibility-questionnaire";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

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

const appointments = [
  {
    id: "appt_001",
    clientId: "client_001",
    client: {
      name: "Martin Dupont",
      phone: "01 23 45 67 89",
      email: "martin.dupont@example.com",
      address: "15 rue des Lilas, 75020 Paris",
      administrativeNotes: "Dossier MPR validé"
    },
    date: "2024-04-05",
    time: "09:30",
    status: "confirmed" as const,
  },
  {
    id: "appt_002",
    clientId: "client_002",
    client: {
      name: "Sophie Martin",
      phone: "06 12 34 56 78",
      email: "sophie.martin@example.com",
      address: "8 avenue des Roses, 69003 Lyon",
      administrativeNotes: "Client prioritaire, personne âgée"
    },
    date: "2024-04-05",
    time: "14:00",
    status: "cancelled" as const,
  },
  {
    id: "appt_003",
    clientId: "client_003",
    client: {
      name: "Jean Petit",
      phone: "07 98 76 54 32",
      email: "jean.petit@example.com",
      address: "23 boulevard des Pins, 33000 Bordeaux",
      administrativeNotes: "Présence d'animaux"
    },
    date: "2024-04-06",
    time: "11:00",
    status: "pending" as const,
  },
  {
    id: "appt_004",
    clientId: "client_004",
    client: {
      name: "Marie Lambert",
      phone: "06 54 32 10 98",
      email: "marie.lambert@example.com",
      address: "42 rue du Commerce, 59000 Lille",
      administrativeNotes: "Accès difficile, prévenir avant d'arriver"
    },
    date: "2024-04-06",
    time: "16:30",
    status: "confirmed" as const,
  },
  {
    id: "appt_005",
    clientId: "client_005",
    client: {
      name: "Pierre Durand",
      phone: "07 65 43 21 09",
      email: "pierre.durand@example.com",
      address: "12 allée des Chênes, 31000 Toulouse",
      administrativeNotes: "Problème d'humidité à vérifier"
    },
    date: "2024-04-07",
    time: "15:00",
    status: "rescheduled" as const,
  }
];

export default function TechnicalVisitQuestionnaireDetailPage() {
  const params = useParams();
  const appointmentId = typeof params.id === "string" ? params.id : "";

  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<(typeof MOCK_APPOINTMENTS)[0] | null>(null);

  // Simuler un chargement de données
  useEffect(() => {
    const timer = setTimeout(() => {
      const foundAppointment = MOCK_APPOINTMENTS.find(a => a.id === appointmentId) || null;
      setAppointment(foundAppointment);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [appointmentId]);

  // Gestionnaire pour la soumission du questionnaire
  const handleSubmitQuestionnaire = (data: any, photos: any[]) => {
    console.log("Questionnaire soumis avec les données:", data);
    console.log("Photos téléchargées:", photos);

    // Dans une application réelle, vous enverriez ces données à votre backend
    // et vous redirigeriez probablement l'utilisateur
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
              <p>Chargement des données du rendez-vous...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="flex items-center mb-6">
              <Button variant="outline" className="mr-4" asChild>
                <Link href="/technical-visit/appointments">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Retour aux rendez-vous
                </Link>
              </Button>
            </div>

            <div className="text-center p-10 border border-dashed border-gray-700 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Rendez-vous introuvable</h3>
              <p className="text-gray-400">
                Le rendez-vous avec l'identifiant <span className="font-mono">{appointmentId}</span> n'a pas été trouvé.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/technical-visit/appointments">
                  Voir tous les rendez-vous
                </Link>
              </Button>
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
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center">
                <Button variant="outline" className="mr-4" asChild>
                  <Link href="/technical-visit/appointments">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Retour aux rendez-vous
                  </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">
                  Questionnaire de visite technique
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="text-gray-400">Rendez-vous:</span>{" "}
                  <span className="font-medium">{new Date(appointment.date).toLocaleDateString('fr-FR')}</span>{" "}
                  <span className="font-medium">à {appointment.time}</span>
                </div>

                <Button
                  variant="default"
                  className="button-highlight"
                  asChild
                >
                  <Link href={`/technical-visit/appointment/${appointmentId}/edit`}>
                    Modifier le rendez-vous
                  </Link>
                </Button>
              </div>
            </div>

            <FeasibilityQuestionnaire
              clientName={appointment.client.name}
              propertyAddress={appointment.client.address}
              appointmentId={appointmentId}
              renovationType={appointment.client.renovationType}
              onSubmit={handleSubmitQuestionnaire}
              initialData={{
                // Vous pourriez charger des données existantes ici si le questionnaire avait déjà été rempli
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
