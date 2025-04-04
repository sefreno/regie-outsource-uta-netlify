// Types d'utilisateurs par service
export enum ServiceType {
  TECHNICAL_VISIT = "technical_visit",   // Visite technique
  INSTALLATION = "installation",         // Installation
  QUALIFICATION = "qualification",       // Qualification
  CONFIRMATION = "confirmation",         // Confirmation
  ADMINISTRATIVE = "administrative",     // Gestion administrative
  BILLING = "billing"                    // Facturation
}

// Type de dossier pour les paiements gouvernementaux
export enum GovernmentFundingType {
  MAPRIMERENOVS = "maprimerenovs",
  CEE = "cee",
  ECO_PTZ = "eco_ptz",
  TVA_REDUITE = "tva_reduite",
  AUTRES = "autres"
}

// Taux de paiement par service
export interface ServiceRates {
  [ServiceType.TECHNICAL_VISIT]: number;  // Prix par visite technique réalisée
  [ServiceType.INSTALLATION]: number;     // Prix par installation réalisée
  [ServiceType.QUALIFICATION]: number;    // Prix par qualification réussie
  [ServiceType.CONFIRMATION]: number;     // Prix par dossier confirmé et installé
  [ServiceType.ADMINISTRATIVE]: number;   // Prix par dossier finalisé
  [ServiceType.BILLING]: number;          // Tarif fixe ou pourcentage
}

// Structure de base pour tous les collaborateurs
export interface Collaborator {
  id: string;
  name: string;
  email: string;
  service: ServiceType;
  rate: number;  // Taux individuel (peut varier selon l'expérience, l'ancienneté, etc.)
  taxNumber?: string;  // Numéro fiscal pour les sous-traitants
  iban?: string;
  active: boolean;
}

// Structure pour une activité facturée
export interface BillableActivity {
  id: string;
  collaboratorId: string;
  serviceType: ServiceType;
  date: Date;
  amount: number;
  status: "pending" | "processed" | "paid";
  reference: string;  // ID du dossier ou de l'activité concernée
  details?: string;
}

// Structure pour les factures mensuelles
export interface MonthlyInvoice {
  id: string;
  collaboratorId: string;
  month: number;  // 1-12
  year: number;
  totalAmount: number;
  activities: BillableActivity[];
  generatedDate: Date;
  paidDate?: Date;
  status: "draft" | "sent" | "paid" | "cancelled";
  invoiceNumber: string;
  paymentReference?: string;
}

// Structure pour les factures gouvernementales
export interface GovernmentInvoice {
  id: string;
  fundingType: GovernmentFundingType;
  dossierIds: string[];
  totalAmount: number;
  submissionDate: Date;
  expectedPaymentDate?: Date;
  paidDate?: Date;
  status: "draft" | "submitted" | "accepted" | "paid" | "rejected";
  invoiceNumber: string;
  referenceNumber?: string;
  rejectionReason?: string;
}

// Structure pour les statistiques de facturation
export interface BillingStatistics {
  totalPending: number;
  totalProcessed: number;
  totalPaid: number;
  monthlyBreakdown: {
    month: number;
    year: number;
    amount: number;
    status: "pending" | "processed" | "paid";
  }[];
  serviceBreakdown: {
    service: ServiceType;
    amount: number;
    count: number;
  }[];
}

// Taux par défaut pour chaque service
export const DEFAULT_SERVICE_RATES: ServiceRates = {
  [ServiceType.TECHNICAL_VISIT]: 50,     // 50€ par visite technique
  [ServiceType.INSTALLATION]: 100,       // 100€ par installation
  [ServiceType.QUALIFICATION]: 25,       // 25€ par qualification
  [ServiceType.CONFIRMATION]: 75,        // 75€ par confirmation aboutie
  [ServiceType.ADMINISTRATIVE]: 30,      // 30€ par dossier finalisé
  [ServiceType.BILLING]: 2000,           // Salaire fixe mensuel
};
