import * as XLSX from 'xlsx';
import { stringify } from 'csv-stringify/sync';
import { saveAs } from 'file-saver';
import type { MonthlyInvoice, BillableActivity, Collaborator, GovernmentInvoice } from './models';

/**
 * Service d'export pour les données de facturation
 * Permet d'exporter les données au format CSV ou Excel
 */
export class BillingExportService {

  /**
   * Exporter les factures mensuelles vers Excel
   */
  public exportMonthlyInvoicesToExcel(invoices: MonthlyInvoice[], filename = 'factures-mensuelles.xlsx'): void {
    // Préparer les données pour l'export
    const invoiceData = invoices.map(invoice => ({
      'Numéro de facture': invoice.invoiceNumber,
      'Collaborateur ID': invoice.collaboratorId,
      'Mois': invoice.month,
      'Année': invoice.year,
      'Montant total': invoice.totalAmount,
      'Date de génération': this.formatDate(invoice.generatedDate),
      'Date de paiement': invoice.paidDate ? this.formatDate(invoice.paidDate) : '',
      'Statut': this.translateInvoiceStatus(invoice.status),
      'Nombre d\'activités': invoice.activities.length,
    }));

    // Créer une feuille de calcul pour les factures
    const ws = XLSX.utils.json_to_sheet(invoiceData);

    // Créer un classeur et ajouter la feuille
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Factures');

    // Si des factures ont des activités, créer une feuille détaillée
    if (invoices.some(inv => inv.activities.length > 0)) {
      const activitiesData: any[] = [];

      invoices.forEach(invoice => {
        invoice.activities.forEach(activity => {
          activitiesData.push({
            'Numéro de facture': invoice.invoiceNumber,
            'Activité ID': activity.id,
            'Collaborateur ID': activity.collaboratorId,
            'Service': this.translateServiceType(activity.serviceType),
            'Date': this.formatDate(new Date(activity.date)),
            'Montant': activity.amount,
            'Statut': this.translateActivityStatus(activity.status),
            'Référence': activity.reference,
            'Détails': activity.details || '',
          });
        });
      });

      // Ajouter la feuille des activités
      const wsActivities = XLSX.utils.json_to_sheet(activitiesData);
      XLSX.utils.book_append_sheet(wb, wsActivities, 'Activités');
    }

    // Générer le fichier Excel et le télécharger
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsFile(excelBuffer, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }

  /**
   * Exporter les activités d'un collaborateur vers CSV
   */
  public exportCollaboratorActivitiesToCSV(activities: BillableActivity[], collaborator: Collaborator, filename?: string): void {
    // Préparer les données
    const data = activities.map(activity => ({
      'ID': activity.id,
      'Service': this.translateServiceType(activity.serviceType),
      'Date': this.formatDate(new Date(activity.date)),
      'Montant': activity.amount,
      'Statut': this.translateActivityStatus(activity.status),
      'Référence': activity.reference,
      'Détails': activity.details || '',
    }));

    // Générer le CSV
    const csvContent = stringify(data, {
      header: true,
      columns: ['ID', 'Service', 'Date', 'Montant', 'Statut', 'Référence', 'Détails'],
    });

    // Déterminer le nom du fichier
    const defaultFilename = `activites-${collaborator.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;

    // Enregistrer le fichier
    this.saveAsFile(
      new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }),
      filename || defaultFilename,
      'text/csv'
    );
  }

  /**
   * Exporter les factures gouvernementales vers Excel
   */
  public exportGovernmentInvoicesToExcel(invoices: GovernmentInvoice[], filename = 'factures-gouvernementales.xlsx'): void {
    // Préparer les données
    const data = invoices.map(invoice => ({
      'Numéro de facture': invoice.invoiceNumber,
      'Type de financement': this.translateFundingType(invoice.fundingType),
      'Nombre de dossiers': invoice.dossierIds.length,
      'Montant total': invoice.totalAmount,
      'Date de soumission': this.formatDate(invoice.submissionDate),
      'Date de paiement prévue': invoice.expectedPaymentDate ? this.formatDate(invoice.expectedPaymentDate) : '',
      'Date de paiement réelle': invoice.paidDate ? this.formatDate(invoice.paidDate) : '',
      'Statut': this.translateGovInvoiceStatus(invoice.status),
      'Numéro de référence': invoice.referenceNumber || '',
    }));

    // Créer une feuille de calcul
    const ws = XLSX.utils.json_to_sheet(data);

    // Créer un classeur et ajouter la feuille
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Factures gouvernementales');

    // Générer le fichier Excel et le télécharger
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsFile(excelBuffer, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }

  /**
   * Exporter les factures mensuelles vers CSV
   */
  public exportMonthlyInvoicesToCSV(invoices: MonthlyInvoice[], filename = 'factures-mensuelles.csv'): void {
    // Préparer les données
    const data = invoices.map(invoice => ({
      'Numéro de facture': invoice.invoiceNumber,
      'Collaborateur ID': invoice.collaboratorId,
      'Mois': invoice.month,
      'Année': invoice.year,
      'Montant total': invoice.totalAmount,
      'Date de génération': this.formatDate(invoice.generatedDate),
      'Date de paiement': invoice.paidDate ? this.formatDate(invoice.paidDate) : '',
      'Statut': this.translateInvoiceStatus(invoice.status),
      'Nombre d\'activités': invoice.activities.length,
    }));

    // Générer le CSV
    const csvContent = stringify(data, {
      header: true,
      columns: ['Numéro de facture', 'Collaborateur ID', 'Mois', 'Année', 'Montant total',
                'Date de génération', 'Date de paiement', 'Statut', 'Nombre d\'activités'],
    });

    // Enregistrer le fichier
    this.saveAsFile(
      new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }),
      filename,
      'text/csv'
    );
  }

  /**
   * Exporter les données comptables complètes (pour une période donnée)
   */
  public exportFullAccountingData(
    invoices: MonthlyInvoice[],
    governmentInvoices: GovernmentInvoice[],
    period: { month: number; year: number },
    filename = 'comptabilite-complete.xlsx'
  ): void {
    // Filtrer les factures pour la période spécifiée
    const filteredInvoices = invoices.filter(
      invoice => invoice.month === period.month && invoice.year === period.year
    );

    // Préparer les données pour les factures collaborateurs
    const invoiceData = filteredInvoices.map(invoice => ({
      'Type': 'Collaborateur',
      'Numéro de facture': invoice.invoiceNumber,
      'Bénéficiaire': invoice.collaboratorId,
      'Mois': invoice.month,
      'Année': invoice.year,
      'Montant total': invoice.totalAmount,
      'Date de génération': this.formatDate(invoice.generatedDate),
      'Date de paiement': invoice.paidDate ? this.formatDate(invoice.paidDate) : '',
      'Statut': this.translateInvoiceStatus(invoice.status),
    }));

    // Préparer les données pour les factures gouvernementales
    const govInvoiceData = governmentInvoices.map(invoice => {
      // Obtenir le mois et l'année de la date de soumission
      const submissionDate = new Date(invoice.submissionDate);
      const month = submissionDate.getMonth() + 1;
      const year = submissionDate.getFullYear();

      // Vérifier si la facture correspond à la période spécifiée
      if (month === period.month && year === period.year) {
        return {
          'Type': 'Gouvernemental',
          'Numéro de facture': invoice.invoiceNumber,
          'Bénéficiaire': this.translateFundingType(invoice.fundingType),
          'Mois': month,
          'Année': year,
          'Montant total': invoice.totalAmount,
          'Date de génération': this.formatDate(invoice.submissionDate),
          'Date de paiement': invoice.paidDate ? this.formatDate(invoice.paidDate) : '',
          'Statut': this.translateGovInvoiceStatus(invoice.status),
        };
      }
      return null;
    }).filter(Boolean);

    // Fusionner les données
    const allInvoices = [...invoiceData, ...govInvoiceData];

    // Créer une feuille de calcul pour toutes les factures
    const ws = XLSX.utils.json_to_sheet(allInvoices);

    // Créer un classeur et ajouter la feuille
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Toutes les factures');

    // Ajouter une feuille pour les statistiques
    const stats = this.calculatePeriodStats(filteredInvoices, govInvoiceData);
    const statsSheet = XLSX.utils.json_to_sheet([stats]);
    XLSX.utils.book_append_sheet(wb, statsSheet, 'Statistiques');

    // Ajouter une feuille détaillée des activités
    const activities: BillableActivity[] = [];
    filteredInvoices.forEach(invoice => {
      activities.push(...invoice.activities);
    });

    if (activities.length > 0) {
      const activitiesData = activities.map(activity => ({
        'ID': activity.id,
        'Collaborateur ID': activity.collaboratorId,
        'Service': this.translateServiceType(activity.serviceType),
        'Date': this.formatDate(new Date(activity.date)),
        'Montant': activity.amount,
        'Statut': this.translateActivityStatus(activity.status),
        'Référence': activity.reference,
      }));

      const activitiesSheet = XLSX.utils.json_to_sheet(activitiesData);
      XLSX.utils.book_append_sheet(wb, activitiesSheet, 'Activités détaillées');
    }

    // Générer le fichier Excel et le télécharger
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsFile(excelBuffer, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }

  // Méthodes privées d'aide

  // Formater une date au format français
  private formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  // Enregistrer un fichier via FileSaver
  private saveAsFile(content: any, filename: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType });
    saveAs(blob, filename);
  }

  // Traduire le statut d'une facture
  private translateInvoiceStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'draft': 'Brouillon',
      'sent': 'Envoyée',
      'paid': 'Payée',
      'cancelled': 'Annulée'
    };
    return statusMap[status] || status;
  }

  // Traduire le statut d'une activité
  private translateActivityStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'En attente',
      'processed': 'Traitée',
      'paid': 'Payée'
    };
    return statusMap[status] || status;
  }

  // Traduire le type de service
  private translateServiceType(serviceType: string): string {
    const serviceMap: Record<string, string> = {
      'technical_visit': 'Visite technique',
      'installation': 'Installation',
      'qualification': 'Qualification',
      'confirmation': 'Confirmation',
      'administrative': 'Administratif',
      'billing': 'Facturation'
    };
    return serviceMap[serviceType] || serviceType;
  }

  // Traduire le type de financement
  private translateFundingType(fundingType: string): string {
    const fundingMap: Record<string, string> = {
      'maprimerenovs': 'MaPrimeRénov\'',
      'cee': 'CEE',
      'eco_ptz': 'Éco-PTZ',
      'tva_reduite': 'TVA réduite',
      'autres': 'Autres dispositifs'
    };
    return fundingMap[fundingType] || fundingType;
  }

  // Traduire le statut d'une facture gouvernementale
  private translateGovInvoiceStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'draft': 'Brouillon',
      'submitted': 'Soumise',
      'accepted': 'Acceptée',
      'paid': 'Payée',
      'rejected': 'Rejetée'
    };
    return statusMap[status] || status;
  }

  // Calculer les statistiques pour une période donnée
  private calculatePeriodStats(
    invoices: MonthlyInvoice[],
    govInvoices: any[]
  ): any {
    // Calculer les totaux
    const totalCollaboratorAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalGovAmount = govInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

    // Calculer les montants par statut
    const collaboratorPaid = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.totalAmount, 0);

    const collaboratorPending = invoices
      .filter(inv => inv.status !== 'paid')
      .reduce((sum, inv) => sum + inv.totalAmount, 0);

    const govPaid = govInvoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.totalAmount, 0);

    const govPending = govInvoices
      .filter(inv => inv.status !== 'paid')
      .reduce((sum, inv) => sum + inv.totalAmount, 0);

    // Retourner les statistiques
    return {
      'Période': `${invoices[0]?.month || '-'}/${invoices[0]?.year || '-'}`,
      'Total Collaborateurs': totalCollaboratorAmount,
      'Collaborateurs Payés': collaboratorPaid,
      'Collaborateurs En attente': collaboratorPending,
      'Total Gouvernement': totalGovAmount,
      'Gouvernement Payé': govPaid,
      'Gouvernement En attente': govPending,
      'TOTAL GLOBAL': totalCollaboratorAmount + totalGovAmount,
      'TOTAL PAYÉ': collaboratorPaid + govPaid,
      'TOTAL EN ATTENTE': collaboratorPending + govPending,
    };
  }
}
