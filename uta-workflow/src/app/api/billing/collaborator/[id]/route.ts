import { type NextRequest, NextResponse } from "next/server";
import { BillingService } from "@/lib/billing/service";
import { type Collaborator, ServiceType, type BillableActivity, type MonthlyInvoice } from "@/lib/billing/models";

// Service de facturation
const billingService = new BillingService();

// Données de test (à remplacer par une base de données réelle)
// Ces données devraient être importées d'une source commune, ici nous les redéfinissons pour simplifier
const mockCollaborators: Collaborator[] = [
  {
    id: "col_001",
    name: "Jean Martin",
    email: "jean.martin@example.com",
    service: ServiceType.TECHNICAL_VISIT,
    rate: 55,
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

// Mock des activités facturables - version simplifiée pour cet exemple
const mockActivities: BillableActivity[] = [
  // Quelques activités pour chaque collaborateur
  ...Array(12).fill(null).map((_, i) => ({
    id: `act_tv_${i+1}`,
    collaboratorId: "col_001",
    serviceType: ServiceType.TECHNICAL_VISIT,
    date: new Date(2025, 3, i+1),
    amount: 55,
    status: "pending",
    reference: `visit_${i+1}`,
    details: `Visite technique #${i+1}`
  })),

  ...Array(8).fill(null).map((_, i) => ({
    id: `act_inst_${i+1}`,
    collaboratorId: "col_002",
    serviceType: ServiceType.INSTALLATION,
    date: new Date(2025, 3, i+5),
    amount: 110,
    status: "pending",
    reference: `inst_${i+1}`,
    details: `Installation #${i+1}`
  })),
];

// Mock des factures mensuelles
const mockInvoices: MonthlyInvoice[] = mockCollaborators.map(collaborator => {
  const collaboratorActivities = mockActivities.filter(
    activity => activity.collaboratorId === collaborator.id
  );

  return {
    id: `inv_20250401_${collaborator.id}`,
    collaboratorId: collaborator.id,
    month: 4,
    year: 2025,
    totalAmount: collaboratorActivities.reduce((sum, activity) => sum + activity.amount, 0),
    activities: collaboratorActivities,
    generatedDate: new Date(2025, 4, 5),
    status: "draft",
    invoiceNumber: `INV-202504-${collaborator.id.substring(0, 8)}`
  };
});

/**
 * GET /api/billing/collaborator/[id]
 * Récupère les données d'un collaborateur et ses factures
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const collaboratorId = params.id;
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') ? Number.parseInt(searchParams.get('month')!) : null;
    const year = searchParams.get('year') ? Number.parseInt(searchParams.get('year')!) : null;

    // Trouver le collaborateur
    const collaborator = mockCollaborators.find(col => col.id === collaboratorId);
    if (!collaborator) {
      return NextResponse.json(
        { error: "Collaborateur non trouvé" },
        { status: 404 }
      );
    }

    // Récupérer les activités du collaborateur
    let activities = mockActivities.filter(
      activity => activity.collaboratorId === collaboratorId
    );

    // Filtrer par mois et année si spécifiés
    if (month !== null && year !== null) {
      activities = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate.getMonth() + 1 === month && activityDate.getFullYear() === year;
      });
    }

    // Récupérer les factures du collaborateur
    let invoices = mockInvoices.filter(
      invoice => invoice.collaboratorId === collaboratorId
    );

    // Filtrer par mois et année si spécifiés
    if (month !== null && year !== null) {
      invoices = invoices.filter(
        invoice => invoice.month === month && invoice.year === year
      );
    }

    // Calculer quelques statistiques
    const statistics = {
      totalActivities: activities.length,
      totalAmount: activities.reduce((sum, activity) => sum + activity.amount, 0),
      invoicesCount: invoices.length,
      pendingAmount: invoices
        .filter(inv => inv.status === "draft" || inv.status === "sent")
        .reduce((sum, inv) => sum + inv.totalAmount, 0),
      paidAmount: invoices
        .filter(inv => inv.status === "paid")
        .reduce((sum, inv) => sum + inv.totalAmount, 0)
    };

    return NextResponse.json({
      collaborator,
      activities,
      invoices,
      statistics
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données du collaborateur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données du collaborateur" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/billing/collaborator/[id]/invoice
 * Génère une facture pour un collaborateur
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const collaboratorId = params.id;
    const body = await request.json();
    const { month, year } = body;

    // Vérifier les champs requis
    if (!month || !year) {
      return NextResponse.json(
        { error: "Mois et année requis" },
        { status: 400 }
      );
    }

    // Vérifier si le collaborateur existe
    const collaborator = mockCollaborators.find(col => col.id === collaboratorId);
    if (!collaborator) {
      return NextResponse.json(
        { error: "Collaborateur non trouvé" },
        { status: 404 }
      );
    }

    // Récupérer les activités du collaborateur pour le mois et l'année spécifiés
    const activities = mockActivities.filter(activity => {
      const activityDate = new Date(activity.date);
      return (
        activity.collaboratorId === collaboratorId &&
        activityDate.getMonth() + 1 === month &&
        activityDate.getFullYear() === year
      );
    });

    // Vérifier s'il y a des activités pour générer une facture
    if (activities.length === 0) {
      return NextResponse.json(
        { error: "Aucune activité trouvée pour cette période" },
        { status: 400 }
      );
    }

    // Vérifier si une facture existe déjà pour cette période
    const existingInvoice = mockInvoices.find(
      inv => inv.collaboratorId === collaboratorId &&
             inv.month === month &&
             inv.year === year
    );

    if (existingInvoice) {
      return NextResponse.json(
        {
          error: "Une facture existe déjà pour cette période",
          invoice: existingInvoice
        },
        { status: 409 } // Conflict
      );
    }

    // Générer la facture
    const invoice = billingService.generateMonthlyInvoice(
      collaborator,
      activities,
      month,
      year
    );

    // Ajouter la facture aux données de test
    mockInvoices.push(invoice);

    return NextResponse.json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error("Erreur lors de la génération de la facture:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération de la facture" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/billing/collaborator/[id]
 * Met à jour les informations d'un collaborateur
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const collaboratorId = params.id;
    const body = await request.json();
    const { name, email, rate, active } = body;

    // Trouver l'index du collaborateur
    const collaboratorIndex = mockCollaborators.findIndex(col => col.id === collaboratorId);
    if (collaboratorIndex === -1) {
      return NextResponse.json(
        { error: "Collaborateur non trouvé" },
        { status: 404 }
      );
    }

    // Mettre à jour les informations du collaborateur
    const updatedCollaborator = {
      ...mockCollaborators[collaboratorIndex],
      ...(name && { name }),
      ...(email && { email }),
      ...(rate && { rate: Number(rate) }),
      ...(active !== undefined && { active })
    };

    // Remplacer le collaborateur dans le tableau
    mockCollaborators[collaboratorIndex] = updatedCollaborator;

    return NextResponse.json({
      success: true,
      collaborator: updatedCollaborator
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du collaborateur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du collaborateur" },
      { status: 500 }
    );
  }
}
