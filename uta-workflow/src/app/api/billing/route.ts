import { type NextRequest, NextResponse } from "next/server";
import { BillingService } from "@/lib/billing/service";
import { type Collaborator, ServiceType, type BillableActivity, type MonthlyInvoice, GovernmentFundingType } from "@/lib/billing/models";

// Service de facturation
const billingService = new BillingService();

// Données de test (à remplacer par une base de données réelle)
const mockCollaborators: Collaborator[] = [
  {
    id: "col_001",
    name: "Jean Martin",
    email: "jean.martin@example.com",
    service: ServiceType.TECHNICAL_VISIT,
    rate: 55,  // Taux personnalisé
    active: true
  },
  {
    id: "col_002",
    name: "Marie Dubois",
    email: "marie.dubois@example.com",
    service: ServiceType.INSTALLATION,
    rate: 110,
    active: true
  },
  {
    id: "col_003",
    name: "Pierre Dupont",
    email: "pierre.dupont@example.com",
    service: ServiceType.QUALIFICATION,
    rate: 30,
    active: true
  },
  {
    id: "col_004",
    name: "Sophie Bernard",
    email: "sophie.bernard@example.com",
    service: ServiceType.CONFIRMATION,
    rate: 80,
    active: true
  },
  {
    id: "col_005",
    name: "Thomas Leclerc",
    email: "thomas.leclerc@example.com",
    service: ServiceType.ADMINISTRATIVE,
    rate: 35,
    active: true
  }
];

// Mock des activités facturables
const mockActivities: BillableActivity[] = [
  // Activités pour Jean Martin (Visite technique)
  ...Array(12).fill(null).map((_, i) => billingService.createBillableActivity(
    mockCollaborators[0],
    `visit_${i+1}`,
    new Date(2025, 3, i+1),
    1,
    `Visite technique #${i+1}`
  )),

  // Activités pour Marie Dubois (Installation)
  ...Array(8).fill(null).map((_, i) => billingService.createBillableActivity(
    mockCollaborators[1],
    `inst_${i+1}`,
    new Date(2025, 3, i+5),
    1,
    `Installation #${i+1}`
  )),

  // Activités pour Pierre Dupont (Qualification)
  ...Array(20).fill(null).map((_, i) => billingService.createBillableActivity(
    mockCollaborators[2],
    `qual_${i+1}`,
    new Date(2025, 3, i+2),
    1,
    `Qualification #${i+1}`
  )),

  // Activités pour Sophie Bernard (Confirmation)
  ...Array(10).fill(null).map((_, i) => billingService.createBillableActivity(
    mockCollaborators[3],
    `conf_${i+1}`,
    new Date(2025, 3, i+3),
    1,
    `Confirmation #${i+1}`
  )),

  // Activités pour Thomas Leclerc (Administratif)
  ...Array(15).fill(null).map((_, i) => billingService.createBillableActivity(
    mockCollaborators[4],
    `adm_${i+1}`,
    new Date(2025, 3, i+1),
    1,
    `Dossier administratif #${i+1}`
  )),
];

// Mock des factures mensuelles
const mockInvoices: MonthlyInvoice[] = mockCollaborators.map(collaborator => {
  const collaboratorActivities = mockActivities.filter(
    activity => activity.collaboratorId === collaborator.id
  );

  return billingService.generateMonthlyInvoice(
    collaborator,
    collaboratorActivities,
    4, // Avril
    2025
  );
});

/**
 * Route GET pour obtenir les factures mensuelles
 * GET /api/billing?month=4&year=2025
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') ? Number.parseInt(searchParams.get('month')!) : new Date().getMonth() + 1;
    const year = searchParams.get('year') ? Number.parseInt(searchParams.get('year')!) : new Date().getFullYear();
    const collaboratorId = searchParams.get('collaboratorId') || undefined;

    // Filtrer les factures par mois et année
    let filteredInvoices = mockInvoices.filter(
      invoice => invoice.month === month && invoice.year === year
    );

    // Filtrer par collaborateur si spécifié
    if (collaboratorId) {
      filteredInvoices = filteredInvoices.filter(
        invoice => invoice.collaboratorId === collaboratorId
      );
    }

    // Calculer les statistiques
    const statistics = billingService.calculateStatistics(filteredInvoices);

    return NextResponse.json({
      invoices: filteredInvoices,
      statistics,
      month,
      year
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des factures:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des factures" },
      { status: 500 }
    );
  }
}

/**
 * Route POST pour créer une nouvelle activité facturable
 * POST /api/billing/activity
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { collaboratorId, reference, date, count, details, serviceType } = body;

    // Vérifier que tous les champs requis sont présents
    if (!collaboratorId || !reference) {
      return NextResponse.json(
        { error: "Collaborateur et référence requis" },
        { status: 400 }
      );
    }

    // Trouver le collaborateur
    const collaborator = mockCollaborators.find(col => col.id === collaboratorId);
    if (!collaborator) {
      return NextResponse.json(
        { error: "Collaborateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier si un service spécifique est demandé (différent du service du collaborateur)
    const effectiveServiceType = serviceType || collaborator.service;

    // Créer l'activité
    const activity = billingService.createBillableActivity(
      collaborator,
      reference,
      date ? new Date(date) : new Date(),
      count || 1,
      details
    );

    // Ajouter l'activité à notre mock de données
    mockActivities.push(activity);

    return NextResponse.json({
      success: true,
      activity
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'activité:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'activité" },
      { status: 500 }
    );
  }
}

/**
 * Route pour créer une facture gouvernementale
 * POST /api/billing/government
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { fundingType, dossierIds, totalAmount } = body;

    // Vérifier que tous les champs requis sont présents
    if (!fundingType || !dossierIds || !totalAmount) {
      return NextResponse.json(
        { error: "Type de financement, liste de dossiers et montant total requis" },
        { status: 400 }
      );
    }

    // Vérifier si le type de financement est valide
    if (!Object.values(GovernmentFundingType).includes(fundingType as GovernmentFundingType)) {
      return NextResponse.json(
        { error: "Type de financement invalide" },
        { status: 400 }
      );
    }

    // Créer la facture gouvernementale
    const invoice = billingService.createGovernmentInvoice(
      fundingType as GovernmentFundingType,
      dossierIds,
      totalAmount
    );

    return NextResponse.json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error("Erreur lors de la création de la facture gouvernementale:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la facture gouvernementale" },
      { status: 500 }
    );
  }
}
