"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// Ajout de l'import pour FileUpload
import { FileUpload } from "@/components/ui/file-upload";

// Schema de validation pour le formulaire de qualification (version simplifiée)
const qualificationSchema = z.object({
  // Informations personnelles du client
  clientName: z.string().min(3, { message: "Le nom du client est requis" }),
  clientEmail: z.string().email({ message: "Adresse email invalide" }),
  clientPhone: z.string().min(10, { message: "Numéro de téléphone invalide" }),
  clientAddress: z.string().min(5, { message: "Adresse complète requise" }),

  // Référence fiscale
  fiscalReference: z.string().min(13, { message: "Référence fiscale invalide" }),

  // Composition du foyer
  householdSize: z.string().min(1, { message: "Le nombre de personnes est requis" }),
  regionType: z.enum(["ILE_DE_FRANCE", "AUTRES_REGIONS"], {
    required_error: "La région est requise",
  }),

  // Détails de la propriété
  propertyType: z.enum(["house", "apartment", "other"], {
    required_error: "Type de logement requis",
  }),
  propertySize: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
    message: "La surface doit être un nombre positif",
  }),
  constructionYear: z.string().refine(
    (val) => !val || (val && !Number.isNaN(Number(val)) && Number(val) >= 1900 && Number(val) <= new Date().getFullYear()),
    {
      message: "L'année de construction doit être valide",
    }
  ),

  // Informations sur le logement
  ownershipStatus: z.enum(["owner_occupant", "owner_landlord", "tenant"], {
    required_error: "Le statut d'occupation est requis",
  }),
  occupancyDuration: z.string().min(1, { message: "Durée d'occupation requise" }),
  primaryResidence: z.boolean(),

  // Caractéristiques énergétiques
  heatingType: z.enum(["electric", "gas", "oil", "wood", "coal", "heat_pump", "other"], {
    required_error: "Le type de chauffage est requis",
  }),
  heatingSystemAge: z.string().optional(),
  energyRating: z.enum(["A", "B", "C", "D", "E", "F", "G", "unknown"], {
    required_error: "La classe énergétique est requise",
  }),

  // Projets de travaux
  workDescription: z.string().min(10, { message: "Une description des travaux envisagés est requise" }).max(1000),
  urgencyLevel: z.enum(["immediate", "soon", "planning"], {
    required_error: "Veuillez indiquer l'urgence des travaux"
  }),

  // Consentements
  consentContact: z.boolean().refine((val) => val, {
    message: "Vous devez consentir à être contacté"
  }),
});

type QualificationFormValues = z.infer<typeof qualificationSchema>;

export default function QualificationForm({ initialConfirmationView = false }: { initialConfirmationView?: boolean }) {
  const [activeTab, setActiveTab] = useState("client");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Initialisation du formulaire avec valeurs par défaut
  const form = useForm<QualificationFormValues>({
    resolver: zodResolver(qualificationSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientAddress: "",
      fiscalReference: "",
      householdSize: "1",
      regionType: "AUTRES_REGIONS",
      propertyType: "house",
      propertySize: "",
      constructionYear: "",
      ownershipStatus: "owner_occupant",
      occupancyDuration: "",
      primaryResidence: true,
      heatingType: "electric",
      heatingSystemAge: "",
      energyRating: "unknown",
      workDescription: "",
      urgencyLevel: "planning",
      consentContact: false,
    },
  });

  // Soumission du formulaire - Version simplifiée pour qualification
  const onSubmit = async (data: QualificationFormValues) => {
    setIsSubmitting(true);

    try {
      // Simulation d'envoi des données au service de confirmation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Dossier transmis au service de confirmation");
      console.log("Données du formulaire:", data);

      // Succès
      setSubmissionSuccess(true);

    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Structure du formulaire avec onglets
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle>
          {initialConfirmationView ? "Données et documents du client" : "Fiche de qualification"}
        </CardTitle>
        <CardDescription>
          {initialConfirmationView
            ? "Consultez les informations du client et ajoutez les documents nécessaires"
            : "Saisissez les informations du client pour une première évaluation"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs
              defaultValue="client"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="client">Client</TabsTrigger>
                <TabsTrigger value="property">Logement</TabsTrigger>
                <TabsTrigger value="project">Projet</TabsTrigger>
              </TabsList>

              {/* Onglet Informations Client */}
              <TabsContent value="client" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Informations personnelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet</FormLabel>
                          <FormControl>
                            <Input placeholder="Jean Dupont" {...field} className="bg-gray-800 border-gray-700" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="jean.dupont@example.com" {...field} className="bg-gray-800 border-gray-700" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="0612345678" {...field} className="bg-gray-800 border-gray-700" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Rue de la Rénovation, 75000 Paris" {...field} className="bg-gray-800 border-gray-700" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-medium mb-4">Composition du foyer</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="householdSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de personnes dans le foyer</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max="10" {...field} className="bg-gray-800 border-gray-700" />
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
                  </div>
                </div>

                {/* Section Document fiscal - masquée en mode confirmation */}
                {!initialConfirmationView && (
                  <>
                    <Separator className="my-6" />

                    <div>
                      <h3 className="text-lg font-medium mb-4">Document fiscal</h3>
                      <FormField
                        control={form.control}
                        name="fiscalReference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Référence de l'avis d'imposition</FormLabel>
                            <FormControl>
                              <div className="flex space-x-2">
                                <Input
                                  placeholder="20XXXXXXXXXX"
                                  {...field}
                                  className="bg-gray-800 border-gray-700"
                                />
                              </div>
                            </FormControl>
                            <FormDescription className="text-xs">
                              Numéro à 13 chiffres en haut à gauche de votre avis d'imposition (commençant souvent par 20)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Onglet Logement */}
              <TabsContent value="property" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Caractéristiques du logement</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de logement</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-gray-800 border-gray-700">
                                <SelectValue placeholder="Sélectionnez un type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="house">Maison individuelle</SelectItem>
                              <SelectItem value="apartment">Appartement</SelectItem>
                              <SelectItem value="other">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="propertySize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Surface habitable (m²)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="80"
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
                      name="constructionYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Année de construction</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1985"
                              min="1900"
                              max={new Date().getFullYear()}
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
                  <h3 className="text-lg font-medium mb-4">Caractéristiques énergétiques</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="heatingType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de chauffage principal</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-gray-800 border-gray-700">
                                <SelectValue placeholder="Sélectionnez un type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="electric">Électrique</SelectItem>
                              <SelectItem value="gas">Gaz</SelectItem>
                              <SelectItem value="oil">Fioul</SelectItem>
                              <SelectItem value="wood">Bois</SelectItem>
                              <SelectItem value="coal">Charbon</SelectItem>
                              <SelectItem value="heat_pump">Pompe à chaleur</SelectItem>
                              <SelectItem value="other">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="heatingSystemAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Âge du système de chauffage (années)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="10"
                              min="0"
                              max="100"
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
                  </div>
                </div>
              </TabsContent>

              {/* Onglet Projet */}
              <TabsContent value="project" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Description du projet de rénovation</h3>

                  <FormField
                    control={form.control}
                    name="workDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description des travaux envisagés</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Décrivez les travaux que vous souhaitez réaliser (isolation, chauffage, fenêtres, etc.)"
                            className="bg-gray-800 border-gray-700 min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="urgencyLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Urgence des travaux</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-gray-800 border-gray-700">
                                <SelectValue placeholder="Sélectionnez l'urgence" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="immediate">Urgent (dans le mois)</SelectItem>
                              <SelectItem value="soon">Prochainement (3-6 mois)</SelectItem>
                              <SelectItem value="planning">En réflexion (plus de 6 mois)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-medium mb-4">Consentement</h3>
                  <FormField
                    control={form.control}
                    name="consentContact"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border border-gray-700">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Consentement au contact</FormLabel>
                          <FormDescription>
                            J'accepte d'être contacté par le service de confirmation concernant ma demande d'aide à la rénovation énergétique.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {submissionSuccess && (
                  <div className="p-4 bg-green-900/30 border border-green-900/50 rounded-md mt-6">
                    <div className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-400">Qualification réussie</h4>
                        <p className="text-sm text-green-400 mt-1">
                          Vos informations ont été transmises au service de confirmation qui vous contactera prochainement pour poursuivre votre dossier.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // Navigation entre onglets
                  const tabs = ["client", "property", "project"];
                  const currentIndex = tabs.indexOf(activeTab);
                  if (currentIndex > 0) {
                    setActiveTab(tabs[currentIndex - 1]);
                  }
                }}
                disabled={activeTab === "client" || isSubmitting}
              >
                Précédent
              </Button>

              {activeTab !== "project" ? (
                <Button
                  type="button"
                  onClick={() => {
                    // Navigation entre onglets
                    const tabs = ["client", "property", "project"];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1]);
                    }
                  }}
                  disabled={isSubmitting}
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="button-highlight button-offset"
                  disabled={isSubmitting || submissionSuccess || initialConfirmationView}
                >
                  {isSubmitting ? "Traitement en cours..." : "Soumettre le dossier"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
