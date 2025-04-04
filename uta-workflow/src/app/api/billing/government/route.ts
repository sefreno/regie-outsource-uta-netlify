import { type NextRequest, NextResponse } from "next/server";
import { BillingService } from "@/lib/billing/service";
import { GovernmentFundingType, type GovernmentInvoice } from "@/lib/billing/models";

// Service de facturation
const billingService = new BillingService();

// Données de test (à remplacer par une base de données réelle)
const mockGovernmentInvoices: GovernmentInvoice[] = [
  {
    id: "gov_001",
    fundingType: GovernmentFundingType.MAPRIMERENOVS,
    dossierIds: ["dossier_001", "dossier_002", "dossier_003"],
    totalAmount: 15000,
    submissionDate: new Date(2025, 3, 15),
    expectedPaymentDate: new Date(2025, 5, 15),
    status: "submitted",
    invoiceNumber: "GOV-MAPRIMERENOVS-202504-ABC123"
  },
  {
    id: "gov_002",
    fundingType: GovernmentFundingType.CEE,
    dossierIds: ["dossier_004", "dossier_005"],
    totalAmount: 8000,
    submissionDate: new Date(2025, 3, 10),
    expectedPaymentDate: new Date(2025, 5, 10),
    paidDate: new Date(2025, 5, 8),
    status: "paid",
    invoiceNumber: "GOV-CEE-202504-DEF456",
    referenceNumber: "REF-20250508-123456"
  },
  {
    id: "gov_003",
    fundingType: GovernmentFundingType.ECO_PTZ,
    dossierIds: ["dossier_006"],
    totalAmount: 5000,
    submissionDate: new Date(2025, 3, 20),
    expectedPaymentDate: new Date(2025, 5, 20),
    status: "accepted",
    invoiceNumber: "GOV-ECO_PTZ-202504-GHI789",
    referenceNumber: "REF-20250425-654321"
  }
];

/**
 * GET /api/billing/government
 * Récupère la liste des factures gouvernementales
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const fundingType = searchParams.get('fundingType');

    // Filtrer par status si spécifié
    let filteredInvoices = [...mockGovernmentInvoices];

    if (status) {
      filteredInvoices = filteredInvoices.filter(
        invoice => invoice.status === status
      );
    }

    // Filtrer par type de financement si spécifié
    if (fundingType) {
      filteredInvoices = filteredInvoices.filter(
        invoice => invoice.fundingType === fundingType
      );
    }

    // Calculer quelques statistiques
    const statistics = {
      totalInvoices: filteredInvoices.length,
      totalAmount: filteredInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      byStatus: {
        draft: filteredInvoices.filter(inv => inv.status === "draft").length,
        submitted: filteredInvoices.filter(inv => inv.status === "submitted").length,
        accepted: filteredInvoices.filter(inv => inv.status === "accepted").length,
        paid: filteredInvoices.filter(inv => inv.status === "paid").length,
        rejected: filteredInvoices.filter(inv => inv.status === "rejected").length
      },
      byFundingType: Object.values(GovernmentFundingType).reduce((acc, type) => {
        acc[type] = filteredInvoices.filter(inv => inv.fundingType === type).length;
        return acc;
      }, {} as Record<string, number>)
    };

    return NextResponse.json({
      invoices: filteredInvoices,
      statistics
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des factures gouvernementales:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des factures gouvernementales" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/billing/government
 * Crée une nouvelle facture gouvernementale
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fundingType, dossierIds, totalAmount } = body;

    // Vérifier les champs requis
    if (!fundingType || !dossierIds || !totalAmount) {
      return NextResponse.json(
        { error: "Type de financement, IDs des dossiers et montant total sont requis" },
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

    // Créer la facture
    const invoice = billingService.createGovernmentInvoice(
      fundingType as GovernmentFundingType,
      dossierIds,
      totalAmount
    );

    // Ajouter à nos données de test
    mockGovernmentInvoices.push(invoice);

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

/**
 * PATCH /api/billing/government
 * Met à jour le statut d'une facture gouvernementale
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, referenceNumber, paidDate, rejectionReason } = body;

    // Vérifier les champs requis
    if (!id || !status) {
      return NextResponse.json(
        { error: "ID de la facture et statut sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si la facture existe
    const invoiceIndex = mockGovernmentInvoices.findIndex(inv => inv.id === id);
    if (invoiceIndex === -1) {
      return NextResponse.json(
        { error: "Facture non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier que le statut est valide
    const validStatuses = ["draft", "submitted", "accepted", "paid", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Statut invalide" },
        { status: 400 }
      );
    }

    // Mettre à jour la facture
    const updatedInvoice = {
      ...mockGovernmentInvoices[invoiceIndex],
      status,
      ...(referenceNumber && { referenceNumber }),
      ...(paidDate && { paidDate: new Date(paidDate) }),
      ...(rejectionReason && { rejectionReason })
    };

    // Si le statut est "paid", ajouter une date de paiement si elle n'est pas déjà définie
    if (status === "paid" && !updatedInvoice.paidDate) {
      updatedInvoice.paidDate = new Date();
    }

    // Remplacer dans le tableau
    mockGovernmentInvoices[invoiceIndex] = updatedInvoice;

    return NextResponse.json({
      success: true,
      invoice: updatedInvoice
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la facture:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la facture" },
      { status: 500 }
    );
  }
}
