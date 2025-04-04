import {
  type BillableActivity,
  type Collaborator,
  DEFAULT_SERVICE_RATES,
  type GovernmentFundingType,
  type GovernmentInvoice,
  type MonthlyInvoice,
  type ServiceRates,
  type ServiceType,
  type BillingStatistics
} from './models';

/**
 * Service de facturation pour calculer les paiements des collaborateurs
 * et gérer les factures gouvernementales
 */
export class BillingService {
  private serviceRates: ServiceRates;

  constructor(customRates?: Partial<ServiceRates>) {
    this.serviceRates = { ...DEFAULT_SERVICE_RATES, ...customRates };
  }

  /**
   * Calculer le montant dû pour une activité basée sur le type de service
   */
  calculateActivityAmount(
    serviceType: ServiceType,
    collaborator: Collaborator,
    count = 1
  ): number {
    // Utiliser le taux du collaborateur s'il est défini, sinon utiliser le taux standard du service
    const rate = collaborator.rate || this.serviceRates[serviceType];
    return rate * count;
  }

  /**
   * Créer une activité facturable
   */
  createBillableActivity(
    collaborator: Collaborator,
    reference: string,
    date: Date = new Date(),
    count = 1,
    details?: string
  ): BillableActivity {
    const amount = this.calculateActivityAmount(collaborator.service, collaborator, count);

    return {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      collaboratorId: collaborator.id,
      serviceType: collaborator.service,
      date,
      amount,
      status: "pending",
      reference,
      details
    };
  }

  /**
   * Générer une facture mensuelle pour un collaborateur
   */
  generateMonthlyInvoice(
    collaborator: Collaborator,
    activities: BillableActivity[],
    month: number,
    year: number
  ): MonthlyInvoice {
    const totalAmount = activities.reduce((sum, activity) => sum + activity.amount, 0);
    const invoiceDate = new Date();

    return {
      id: `inv_${year}${month.toString().padStart(2, '0')}_${collaborator.id}`,
      collaboratorId: collaborator.id,
      month,
      year,
      totalAmount,
      activities,
      generatedDate: invoiceDate,
      status: "draft",
      invoiceNumber: `INV-${year}${month.toString().padStart(2, '0')}-${collaborator.id.substring(0, 8)}`
    };
  }

  /**
   * Créer une facture gouvernementale pour un ensemble de dossiers
   */
  createGovernmentInvoice(
    fundingType: GovernmentFundingType,
    dossierIds: string[],
    totalAmount: number
  ): GovernmentInvoice {
    const submissionDate = new Date();
    const invoiceNumber = `GOV-${fundingType.toUpperCase()}-${submissionDate.getFullYear()}${(submissionDate.getMonth() + 1).toString().padStart(2, '0')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    return {
      id: `gov_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      fundingType,
      dossierIds,
      totalAmount,
      submissionDate,
      expectedPaymentDate: new Date(submissionDate.getTime() + 60 * 24 * 60 * 60 * 1000), // +60 jours
      status: "draft",
      invoiceNumber
    };
  }

  /**
   * Filtrer les activités par mois et année
   */
  filterActivitiesByMonth(
    activities: BillableActivity[],
    month: number,
    year: number
  ): BillableActivity[] {
    return activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate.getMonth() + 1 === month && activityDate.getFullYear() === year;
    });
  }

  /**
   * Compter les activités pour un collaborateur par type de service
   */
  countActivitiesByService(
    activities: BillableActivity[],
    serviceType: ServiceType
  ): number {
    return activities.filter(activity => activity.serviceType === serviceType).length;
  }

  /**
   * Calculer les statistiques de facturation
   */
  calculateStatistics(invoices: MonthlyInvoice[]): BillingStatistics {
    // Initialiser les totaux
    let totalPending = 0;
    const totalProcessed = 0;
    let totalPaid = 0;

    // Calculer les totaux par statut
    invoices.forEach(invoice => {
      switch(invoice.status) {
        case "draft":
        case "sent":
          totalPending += invoice.totalAmount;
          break;
        case "paid":
          totalPaid += invoice.totalAmount;
          break;
        case "cancelled":
          // Ne pas compter les factures annulées
          break;
      }
    });

    // Répartition mensuelle
    const monthlyMap = new Map<string, { month: number; year: number; amount: number; status: "pending" | "processed" | "paid" }>();

    invoices.forEach(invoice => {
      const key = `${invoice.year}-${invoice.month}`;
      const existingEntry = monthlyMap.get(key);

      const status: "pending" | "processed" | "paid" =
        invoice.status === "paid" ? "paid" :
        invoice.status === "sent" ? "processed" : "pending";

      if (existingEntry) {
        existingEntry.amount += invoice.totalAmount;
        // Prioriser le statut le plus avancé
        if (status === "paid" || (status === "processed" && existingEntry.status === "pending")) {
          existingEntry.status = status;
        }
      } else {
        monthlyMap.set(key, {
          month: invoice.month,
          year: invoice.year,
          amount: invoice.totalAmount,
          status
        });
      }
    });

    // Répartition par service
    const serviceMap = new Map<ServiceType, { service: ServiceType; amount: number; count: number }>();

    invoices.forEach(invoice => {
      invoice.activities.forEach(activity => {
        const service = activity.serviceType;
        const existingEntry = serviceMap.get(service);

        if (existingEntry) {
          existingEntry.amount += activity.amount;
          existingEntry.count += 1;
        } else {
          serviceMap.set(service, {
            service,
            amount: activity.amount,
            count: 1
          });
        }
      });
    });

    return {
      totalPending,
      totalProcessed,
      totalPaid,
      monthlyBreakdown: Array.from(monthlyMap.values()),
      serviceBreakdown: Array.from(serviceMap.values())
    };
  }

  /**
   * Générer un numéro de facture unique
   */
  generateInvoiceNumber(prefix: string, collaboratorId: string, date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();

    return `${prefix}-${year}${month}-${collaboratorId.substring(0, 6)}-${random}`;
  }

  /**
   * Mettre à jour les taux de service
   */
  updateServiceRates(newRates: Partial<ServiceRates>): void {
    this.serviceRates = { ...this.serviceRates, ...newRates };
  }
}
