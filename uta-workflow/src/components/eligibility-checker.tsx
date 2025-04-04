"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

// Schema pour la vérification d'éligibilité
const eligibilitySchema = z.object({
  income: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
    message: "Le revenu fiscal doit être un nombre positif",
  }),
  householdSize: z.string().min(1, { message: "Le nombre de personnes est requis" }),
  regionType: z.enum(["ILE_DE_FRANCE", "AUTRES_REGIONS"], {
    required_error: "La région est requise",
  }),
  energyRating: z.enum(["A", "B", "C", "D", "E", "F", "G", "unknown"], {
    required_error: "La classe énergétique est requise",
  }),
  propertyAge: z.string().refine(
    (val) => !val || (val && !Number.isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 150),
    {
      message: "L'âge du logement doit être valide",
    }
  ),
  ownershipStatus: z.enum(["owner_occupant", "owner_landlord", "tenant"], {
    required_error: "Le statut d'occupation est requis",
  }),
  workType: z.enum(["insulation", "heating", "windows", "ventilation", "multiple"], {
    required_error: "Le type de travaux est requis",
  }),
});

type EligibilityFormValues = z.infer<typeof eligibilitySchema>;

// Seuils de revenus pour MaPrimeRénov' (simplifiés pour la démonstration)
const MPR_THRESHOLDS = {
  ILE_DE_FRANCE: {
    1: { BLEU: 22461, JAUNE: 27343, VIOLET: 38184, ROSE: 38184 },
    2: { BLEU: 32967, JAUNE: 40130, VIOLET: 56130, ROSE: 56130 },
    3: { BLEU: 39591, JAUNE: 48197, VIOLET: 67585, ROSE: 67585 },
    4: { BLEU: 46226, JAUNE: 56277, VIOLET: 79041, ROSE: 79041 },
    5: { BLEU: 52886, JAUNE: 64380, VIOLET: 90496, ROSE: 90496 },
    "par personne supp": { BLEU: 6650, JAUNE: 8097, VIOLET: 11455, ROSE: 11455 }
  },
  AUTRES_REGIONS: {
    1: { BLEU: 16229, JAUNE: 20805, VIOLET: 29148, ROSE: 29148 },
    2: { BLEU: 23734, JAUNE: 30427, VIOLET: 42848, ROSE: 42848 },
    3: { BLEU: 28545, JAUNE: 36591, VIOLET: 51592, ROSE: 51592 },
    4: { BLEU: 33346, JAUNE: 42748, VIOLET: 60336, ROSE: 60336 },
    5: { BLEU: 38168, JAUNE: 48930, VIOLET: 69081, ROSE: 69081 },
    "par personne supp": { BLEU: 4813, JAUNE: 6165, VIOLET: 8744, ROSE: 8744 }
  }
};

export function EligibilityChecker() {
  const [isChecking, setIsChecking] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<{
    eligible: boolean;
    profile?: "BLEU" | "JAUNE" | "VIOLET" | "ROSE" | null;
    anah?: boolean;
    message?: string;
  } | null>(null);

  // Initialisation du formulaire
  const form = useForm<EligibilityFormValues>({
    resolver: zodResolver(eligibilitySchema),
    defaultValues: {
      income: "",
      householdSize: "1",
      regionType: "AUTRES_REGIONS",
      energyRating: "unknown",
      propertyAge: "",
      ownershipStatus: "owner_occupant",
      workType: "insulation",
    },
  });

  const checkEligibility = async (data: EligibilityFormValues) => {
    setIsChecking(true);

    try {
      // Simulation du temps de traitement
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const income = Number(data.income);
      const householdSize = Number(data.householdSize);
      const region = data.regionType;
      const energyRating = data.energyRating;
      const ownershipStatus = data.ownershipStatus;

      // Déterminer le profil MaPrimeRénov'
      let profile: "BLEU" | "JAUNE" | "VIOLET" | "ROSE" | null = null;
      let eligible = false;
      let eligibleAnah = false;

      // Logique simplifiée pour la démonstration
      const size = Math.min(householdSize, 5) as 1 | 2 | 3 | 4 | 5;

      // Vérification du profil MPR
      if (income <= MPR_THRESHOLDS[region][size].BLEU) {
        profile = "BLEU";
        eligible = true;
        eligibleAnah = true;
      } else if (income <= MPR_THRESHOLDS[region][size].JAUNE) {
        profile = "JAUNE";
        eligible = true;
      } else if (income <= MPR_THRESHOLDS[region][size].VIOLET) {
        profile = "VIOLET";
        eligible = true;
      } else {
        profile = "ROSE";
        eligible = true;
      }

      // Conditions supplémentaires
      if (ownershipStatus === "tenant") {
        eligible = false;
        eligibleAnah = false;
      }

      // Étiquette énergétique
      if (energyRating === "A" || energyRating === "B") {
        eligible = eligible && ["insulation", "ventilation"].includes(data.workType);
      }

      setEligibilityResult({
        eligible,
        profile: eligible ? profile : null,
        anah: eligibleAnah,
        message: eligible
          ? `Le client est éligible au profil MaPrimeRénov' ${profile}${eligibleAnah ? " et aux aides de l'Anah" : ""}`
          : "Le client n'est pas éligible aux aides MaPrimeRénov' selon les critères saisis."
      });

    } catch (error) {
      console.error("Erreur lors de la vérification d'éligibilité:", error);
      setEligibilityResult({
        eligible: false,
        message: "Une erreur est survenue lors de la vérification d'éligibilité."
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(checkEligibility)} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Informations financières et fiscales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Revenu fiscal de référence</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="25000"
                        {...field}
                        className="bg-gray-800 border-gray-700"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Le revenu fiscal de référence indiqué sur l'avis d'imposition
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="householdSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de personnes dans le foyer</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        {...field}
                        className="bg-gray-800 border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="regionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Région</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Sélectionnez votre région" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="ILE_DE_FRANCE">Île-de-France</SelectItem>
                        <SelectItem value="AUTRES_REGIONS">Autres régions</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ownershipStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut d'occupation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Sélectionnez un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="owner_occupant">Propriétaire occupant</SelectItem>
                        <SelectItem value="owner_landlord">Propriétaire bailleur</SelectItem>
                        <SelectItem value="tenant">Locataire</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Note: Les locataires ont besoin de l'accord du propriétaire
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="text-lg font-medium mb-4">Caractéristiques du logement et des travaux</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="energyRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Étiquette énergétique (DPE)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Sélectionnez une étiquette" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="A">A - Très économe</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                        <SelectItem value="E">E</SelectItem>
                        <SelectItem value="F">F</SelectItem>
                        <SelectItem value="G">G - Très énergivore</SelectItem>
                        <SelectItem value="unknown">Je ne sais pas</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="propertyAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Âge du logement (années)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="25"
                        min="0"
                        max="150"
                        {...field}
                        className="bg-gray-800 border-gray-700"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Logement de plus de 15 ans pour MaPrimeRénov'
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de travaux envisagés</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Sélectionnez le type de travaux" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="insulation">Isolation</SelectItem>
                        <SelectItem value="heating">Chauffage</SelectItem>
                        <SelectItem value="windows">Fenêtres</SelectItem>
                        <SelectItem value="ventilation">Ventilation</SelectItem>
                        <SelectItem value="multiple">Rénovation globale</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              className="button-highlight button-offset"
              disabled={isChecking}
            >
              {isChecking ? "Vérification en cours..." : "Vérifier l'éligibilité"}
            </Button>
          </div>

          {eligibilityResult && (
            <div className={`p-4 ${eligibilityResult.eligible ? "bg-green-900/30 border-green-900/50" : "bg-red-900/30 border-red-900/50"} border rounded-md mt-6`}>
              <div className="flex items-start">
                {eligibilityResult.eligible ? (
                  <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                ) : (
                  <X className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                )}
                <div>
                  <h4 className={`font-medium ${eligibilityResult.eligible ? "text-green-400" : "text-red-400"}`}>
                    {eligibilityResult.eligible ? "Éligible" : "Non éligible"}
                  </h4>
                  <p className={`text-sm mt-1 ${eligibilityResult.eligible ? "text-green-400" : "text-red-400"}`}>
                    {eligibilityResult.message}
                  </p>

                  {eligibilityResult.eligible && eligibilityResult.profile && (
                    <div className="mt-4">
                      <div className="flex items-center">
                        <div className={`h-4 w-4 rounded-full mr-2 ${
                          eligibilityResult.profile === "BLEU" ? "bg-blue-500" :
                          eligibilityResult.profile === "JAUNE" ? "bg-yellow-500" :
                          eligibilityResult.profile === "VIOLET" ? "bg-purple-500" :
                          "bg-pink-500"
                        }`}></div>
                        <span className="font-medium">
                          MaPrimeRénov' {eligibilityResult.profile}
                        </span>
                      </div>

                      {eligibilityResult.anah && (
                        <div className="flex items-center mt-2">
                          <div className="h-4 w-4 rounded-full bg-teal-500 mr-2"></div>
                          <span className="font-medium">Éligible aux aides de l'Anah</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
