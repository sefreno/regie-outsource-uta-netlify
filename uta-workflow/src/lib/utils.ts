import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { parse } from "date-fns";

// Fonction pour combiner des classes CSS avec Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fonction pour convertir les rendez-vous en événements du calendrier
export function appointmentsToCalendarEvents(appointments: any[]) {
  return appointments.map(appointment => {
    // Convertir les dates (supposant que appointment.date soit au format "YYYY-MM-DD")
    const startDate = typeof appointment.date === 'string'
      ? parseAppointmentDateTime(appointment.date, appointment.time)
      : appointment.date;

    // Calculer la date de fin (par défaut, 1 heure après le début)
    const endDate = new Date(startDate.getTime());
    endDate.setHours(endDate.getHours() + 1);

    return {
      id: appointment.id,
      title: `Visite - ${appointment.client.name}`,
      start: startDate,
      end: endDate,
      resource: {
        client: appointment.client,
        status: appointment.status,
        notes: appointment.client.administrativeNotes,
      },
    };
  });
}

// Fonction pour analyser les dates et heures des rendez-vous
export function parseAppointmentDateTime(dateString: string, timeString: string) {
  // Analyser la date au format "YYYY-MM-DD" ou "DD/MM/YYYY"
  let date;
  if (dateString.includes('-')) {
    date = parse(dateString, 'yyyy-MM-dd', new Date());
  } else if (dateString.includes('/')) {
    date = parse(dateString, 'dd/MM/yyyy', new Date());
  } else {
    // Valeur par défaut si le format n'est pas reconnu
    date = new Date();
  }

  // Analyser l'heure au format "HH:MM"
  if (timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    date.setHours(hours || 0);
    date.setMinutes(minutes || 0);
  }

  return date;
}

// Formatter une date pour l'affichage
export function formatAppointmentDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

// Formatter une heure pour l'affichage
export function formatAppointmentTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

/**
 * Formater un nombre avec des espaces comme séparateurs de milliers
 * @param number Nombre à formater
 * @returns Chaîne formatée avec des espaces comme séparateurs de milliers
 */
export function formatNumberWithSpaces(number: number): string {
  return new Intl.NumberFormat('fr-FR', {
    useGrouping: true,
  }).format(number);
}

/**
 * Formater un montant en euros
 * @param amount Montant à formater
 * @param options Options supplémentaires pour le formatage
 * @returns Chaîne formatée en euros
 */
export const formatCurrency = (
  amount: number,
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options
  }).format(amount);
};
