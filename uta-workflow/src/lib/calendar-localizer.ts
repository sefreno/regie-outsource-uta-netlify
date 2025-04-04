import { DateLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Localizer personnalisé pour react-big-calendar utilisant date-fns
 * Cette implémentation est adaptée de 'react-big-calendar/lib/localizers/date-fns'
 * avec une adaptation pour la locale française
 */
export const dateFnsLocalizer = new DateLocalizer({
  format: (date: Date, formatString: string, options: { locale?: Locale } = {}) => {
    return format(date, formatString, { locale: options.locale || fr });
  },

  formats: {
    dateFormat: 'dd',
    dayFormat: 'dd EEE',
    weekdayFormat: 'EEE',
    selectRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${format(start, 'PPP', { locale: fr })} – ${format(end, 'PPP', { locale: fr })}`,
    eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${format(start, 'HH:mm', { locale: fr })} – ${format(end, 'HH:mm', { locale: fr })}`,
    eventTimeRangeStartFormat: ({ start }: { start: Date }) =>
      `${format(start, 'HH:mm', { locale: fr })} →`,
    eventTimeRangeEndFormat: ({ end }: { end: Date }) =>
      `→ ${format(end, 'HH:mm', { locale: fr })}`,
    timeGutterFormat: 'HH:mm',
    monthHeaderFormat: 'MMMM yyyy',
    dayHeaderFormat: 'EEEE dd MMMM',
    dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${format(start, 'dd MMM', { locale: fr })} – ${format(end, 'dd MMM', { locale: fr })}`,
    agendaHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${format(start, 'MMMM yyyy', { locale: fr })}`,
    agendaDateFormat: 'EEE dd',
    agendaTimeFormat: 'HH:mm',
    agendaTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${format(start, 'HH:mm', { locale: fr })} – ${format(end, 'HH:mm', { locale: fr })}`,
  },

  firstOfWeek: () => getDay(startOfWeek(new Date(), { locale: fr })),

  parse: (dateString: string, formatString: string) => {
    if (!dateString) return new Date(Number.NaN);
    return parse(dateString, formatString, new Date(), { locale: fr });
  }
});
