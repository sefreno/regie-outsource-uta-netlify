"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import QualificationForm from "./qualification-form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageLayout } from "@/components/layout/page-layout";
import { useDossiers } from "@/lib/dossier-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const qualificationSchema = z.object({
  clientName: z.string().min(3, { message: "Le nom du client est requis" }),
  clientEmail: z.string().email({ message: "Adresse email invalide" }),
  clientPhone: z.string().min(10, { message: "Numéro de téléphone invalide" }),
  clientAddress: z.string().min(5, { message: "Adresse complète requise" }),
  fiscalReference: z.string().min(13, { message: "Référence fiscale invalide" }),

  // Détails du logement
  homeType: z.enum(["house", "apartment", "other"], {
    required_error: "Sélectionnez un type de logement",
  }),
  homeSize: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
    message: "La surface doit être un nombre positif",
  }),
  constructionYear: z.string().refine(
    (val) => !val || (val && !Number.isNaN(Number(val)) && Number(val) >= 1900 && Number(val) <= new Date().getFullYear()),
    {
      message: "L'année de construction doit être valide",
    }
  ),
  heatingType: z.enum(["electric", "gas", "oil", "wood", "other"], {
    required_error: "Sélectionnez un type de chauffage",
  }),
  currentConsumption: z.string().optional(),
  isOwner: z.enum(["true", "false"], {
    required_error: "Précisez si le client est propriétaire",
  }),

  // Éligibilité
  incomeCategory: z.enum(["very_modest", "modest", "intermediate", "high"], {
    required_error: "Sélectionnez une catégorie de revenus",
  }),
});

type QualificationFormValues = z.infer<typeof qualificationSchema>;

export default function QualificationPage() {
  const { createDossier, transferDossier } = useDossiers();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isFiscalValid, setIsFiscalValid] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<QualificationFormValues>({
    resolver: zodResolver(qualificationSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientAddress: "",
      fiscalReference: "",
      homeType: "house",
      homeSize: "",
      constructionYear: "",
      heatingType: "electric",
      currentConsumption: "",
      isOwner: "true",
      incomeCategory: "modest",
    },
  });

  const verifyFiscalReference = async (reference: string) => {
    if (reference.length < 13) {
      setIsFiscalValid(null);
      return;
    }

    setIsVerifying(true);
    try {
      // Simulation de vérification - dans une vraie app, ce serait un appel API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const isValid = reference.startsWith("13") || Math.random() > 0.3;
      setIsFiscalValid(isValid);
    } catch (error) {
      console.error("Erreur lors de la vérification fiscale:", error);
      setIsFiscalValid(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const getSubsidyRate = (category: string): number => {
    switch (category) {
      case "very_modest":
        return 90;
      case "modest":
        return 75;
      case "intermediate":
        return 40;
      case "high":
        return 25;
      default:
        return 0;
    }
  };

  const onSubmit = async (data: QualificationFormValues) => {
    setIsSubmitting(true);
    try {
      // Créer le dossier en qualification
      const newDossier = await createDossier({
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        clientAddress: data.clientAddress,
        homeDetails: {
          type: data.homeType,
          size: Number(data.homeSize),
          constructionYear: data.constructionYear ? Number(data.constructionYear) : undefined,
          heatingType: data.heatingType,
          currentConsumption: data.currentConsumption ? Number(data.currentConsumption) : undefined,
          isOwner: data.isOwner === "true",
        },
        eligibility: {
          fiscalReference: data.fiscalReference,
          isVerified: isFiscalValid === true,
          incomeCategory: data.incomeCategory,
          subsidyRate: getSubsidyRate(data.incomeCategory),
        },
        notes: ["Dossier créé par le service qualification"],
      });

      // Transférer vers le service confirmation
      await transferDossier(newDossier.id, "confirmation");
      toast.success("Dossier créé et transféré au service confirmation");
      form.reset();
    } catch (error) {
      console.error("Erreur lors de la création du dossier:", error);
      toast.error("Erreur lors de la création du dossier");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    router.push("/qualification/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Qualification Client</h1>
              <Button
                variant="outline"
                className="button-highlight"
                asChild
              >
                <Link href="/dashboard/">Retour au tableau de bord</Link>
              </Button>
            </div>

            <QualificationForm />
          </div>
        </main>
      </div>
    </div>
  );
}
