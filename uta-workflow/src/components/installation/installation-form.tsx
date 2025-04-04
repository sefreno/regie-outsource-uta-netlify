"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { PhotoUploadSection } from "@/components/installation/photo-upload-section"; // Modifier l'import pour inclure le nouvel import de PhotoUploadSection
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Camera, FilePenLine } from "lucide-react";
import { SignaturePad } from "@/components/ui/signature-pad";

// Schéma du formulaire d'installation avec validation
const installationSchema = z.object({
  // Informations générales
  installationDate: z.string(),
  installer: z.string(),

  // Détails de l'installation
  installationType: z.string(),
  materials: z.string(),

  // Informations techniques
  powerSupply: z.enum(["single_phase", "three_phase"]),
  electricalPanel: z.enum(["compatible", "upgrade_needed", "unknown"]),

  // Conditions spécifiques
  accessConditions: z.string(),
  spaceConstraints: z.string(),

  // Présence d'obstacles
  obstacles: z.array(z.string()).optional(),
  otherObstacles: z.string().optional(),

  // Vérifications pré-installation
  preInstallationChecks: z.array(z.string()).optional(),
  otherChecks: z.string().optional(),

  // Commentaires et notes
  installationNotes: z.string(),
  specialInstructions: z.string().optional(),

  // Coûts additionnels
  additionalCosts: z.boolean(),
  additionalCostsDetails: z.string().optional(),
  estimatedAdditionalCost: z.string().optional(),

  // Signatures (ajouté)
  clientName: z.string(),
  clientEmail: z.string().email("Adresse e-mail invalide").optional(),
  clientPhone: z.string().optional(),
  acceptTerms: z.boolean(),
});

type InstallationValues = z.infer<typeof installationSchema>;

interface InstallationFormProps {
  clientName: string;
  propertyAddress: string;
  installationId: string;
  installationType: string;
  onSubmit: (data: InstallationValues, photos: FileWithPreview[], signatures: { client: string; installer: string; installationPhotos: { before: FileWithPreview[]; after: FileWithPreview[] } }) => void;
  initialData?: Partial<InstallationValues>;
}

export type FileWithPreview = File & {
  preview?: string;
};

export function InstallationForm({
  clientName,
  propertyAddress,
  installationId,
  installationType,
  onSubmit,
  initialData = {},
}: InstallationFormProps) {
  const [photos, setPhotos] = useState<FileWithPreview[]>([]);
  const [installationPhotos, setInstallationPhotos] = useState<{
    before: FileWithPreview[];
    after: FileWithPreview[];
  }>({ before: [], after: [] }); // Ajouter un nouveau state pour les photos avant/après
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // États pour les signatures
  const [clientSignature, setClientSignature] = useState<string>("");
  const [installerSignature, setInstallerSignature] = useState<string>("");

  // Récupérer la date du jour pour le champ date d'installation
  const today = new Date().toISOString().split("T")[0];

  // Initialisation du formulaire avec les valeurs par défaut ou les données existantes
  const form = useForm<InstallationValues>({
    resolver: zodResolver(installationSchema),
    defaultValues: {
      installationDate: initialData.installationDate || today,
      installer: initialData.installer || "",
      installationType: initialData.installationType || installationType,
      materials: initialData.materials || "",
      powerSupply: initialData.powerSupply || "single_phase",
      electricalPanel: initialData.electricalPanel || "unknown",
      accessConditions: initialData.accessConditions || "",
      spaceConstraints: initialData.spaceConstraints || "",
      obstacles: initialData.obstacles || [],
      otherObstacles: initialData.otherObstacles || "",
      preInstallationChecks: initialData.preInstallationChecks || [],
      otherChecks: initialData.otherChecks || "",
      installationNotes: initialData.installationNotes || "",
      specialInstructions: initialData.specialInstructions || "",
      additionalCosts: initialData.additionalCosts || false,
      additionalCostsDetails: initialData.additionalCostsDetails || "",
      estimatedAdditionalCost: initialData.estimatedAdditionalCost || "",
      clientName: initialData.clientName || clientName,
      clientEmail: initialData.clientEmail || "",
      clientPhone: initialData.clientPhone || "",
      acceptTerms: initialData.acceptTerms || false,
    },
  });

  // Gérer la soumission du formulaire
  const handleSubmit = async (values: InstallationValues) => {
    // Vérifier si les signatures sont présentes
    if (!clientSignature) {
      setSubmitResult({
        success: false,
        message: "La signature du client est requise pour finaliser le formulaire."
      });
      return;
    }

    if (!installerSignature) {
      setSubmitResult({
        success: false,
        message: "La signature de l'installateur est requise pour finaliser le formulaire."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulation d'un temps de traitement
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Appeler la fonction onSubmit du parent avec les données et les signatures
      onSubmit(values, photos, {
        client: clientSignature,
        installer: installerSignature,
        installationPhotos
      }); // Ajouter installationPhotos aux données envoyées

      // Afficher un message de succès
      setSubmitResult({
        success: true,
        message: "Le formulaire d'installation a été enregistré avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire d'installation:", error);
      setSubmitResult({
        success: false,
        message: "Une erreur est survenue lors de l'enregistrement du formulaire."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Formulaire d'installation</CardTitle>
          <CardDescription>
            Pour le client: {clientName} - {propertyAddress}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              {/* Section: Informations générales */}
              <div>
                <h3 className="text-lg font-medium mb-4">Informations générales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="installationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date d'installation</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
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
                    name="installer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de l'installateur</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Jean Dupont"
                            {...field}
                            className="bg-gray-800 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Section: Détails de l'installation */}
              <div>
                <h3 className="text-lg font-medium mb-4">Détails de l'installation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="installationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type d'installation</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Pompe à chaleur, Isolation thermique..."
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
                    name="materials"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Matériaux utilisés</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Liste des matériaux utilisés..."
                            {...field}
                            className="bg-gray-800 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Section: Informations techniques */}
              <div>
                <h3 className="text-lg font-medium mb-4">Informations techniques</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="powerSupply"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alimentation électrique</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-gray-800 border-gray-700">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="single_phase">Monophasé</SelectItem>
                            <SelectItem value="three_phase">Triphasé</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="electricalPanel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tableau électrique</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-gray-800 border-gray-700">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="compatible">Compatible</SelectItem>
                            <SelectItem value="upgrade_needed">Mise à niveau nécessaire</SelectItem>
                            <SelectItem value="unknown">Non déterminé</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Section: Conditions d'accès et contraintes */}
              <div>
                <h3 className="text-lg font-medium mb-4">Conditions d'accès et contraintes</h3>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="accessConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conditions d'accès au chantier</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Décrivez les conditions d'accès..."
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
                    name="spaceConstraints"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraintes d'espace</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Décrivez les contraintes d'espace..."
                            {...field}
                            className="bg-gray-800 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-4">
                  <FormLabel>Présence d'obstacles</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {["Poutres apparentes", "Conduits de ventilation", "Tuyauterie", "Câblage électrique"].map((obstacle) => (
                      <div key={obstacle} className="flex items-center space-x-2">
                        <Checkbox
                          id={obstacle}
                          onCheckedChange={(checked) => {
                            const currentObstacles = form.getValues("obstacles") || [];
                            if (checked) {
                              form.setValue("obstacles", [...currentObstacles, obstacle]);
                            } else {
                              form.setValue(
                                "obstacles",
                                currentObstacles.filter((o) => o !== obstacle)
                              );
                            }
                          }}
                          checked={(form.getValues("obstacles") || []).includes(obstacle)}
                        />
                        <label
                          htmlFor={obstacle}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {obstacle}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="otherObstacles"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Autres obstacles</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Précisez d'autres obstacles..."
                              {...field}
                              className="bg-gray-800 border-gray-700"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Section: Vérifications pré-installation */}
              <div>
                <h3 className="text-lg font-medium mb-4">Vérifications pré-installation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {[
                    "Vérification de l'alimentation électrique",
                    "Vérification des points d'ancrage",
                    "Vérification de l'étanchéité",
                    "Vérification des dimensions",
                  ].map((check) => (
                    <div key={check} className="flex items-center space-x-2">
                      <Checkbox
                        id={check}
                        onCheckedChange={(checked) => {
                          const currentChecks = form.getValues("preInstallationChecks") || [];
                          if (checked) {
                            form.setValue("preInstallationChecks", [...currentChecks, check]);
                          } else {
                            form.setValue(
                              "preInstallationChecks",
                              currentChecks.filter((c) => c !== check)
                            );
                          }
                        }}
                        checked={(form.getValues("preInstallationChecks") || []).includes(check)}
                      />
                      <label
                        htmlFor={check}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {check}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="otherChecks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Autres vérifications</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Autres vérifications effectuées..."
                            {...field}
                            className="bg-gray-800 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Section: Commentaires et notes */}
              <div>
                <h3 className="text-lg font-medium mb-4">Commentaires et notes</h3>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="installationNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes d'installation</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Notes concernant l'installation..."
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
                    name="specialInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructions spéciales</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Instructions spéciales pour cette installation..."
                            {...field}
                            className="bg-gray-800 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Section: Coûts additionnels */}
              <div>
                <h3 className="text-lg font-medium mb-4">Coûts additionnels</h3>
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="additionalCosts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border border-gray-800">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Coûts additionnels prévisibles
                          </FormLabel>
                          <FormDescription>
                            Cochez cette case si des coûts supplémentaires sont à prévoir
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch("additionalCosts") && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="additionalCostsDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Détails des coûts additionnels</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Précisez les coûts additionnels..."
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
                        name="estimatedAdditionalCost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estimation du coût additionnel</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="1500€"
                                {...field}
                                className="bg-gray-800 border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Section: Photos */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-primary" />
                  Photos (facultatif)
                </h3>
                <FileUpload
                  value={photos}
                  onChange={setPhotos}
                  maxFiles={10}
                  accept={{
                    "image/jpeg": [".jpg", ".jpeg"],
                    "image/png": [".png"],
                  }}
                />
                <FormDescription className="mt-2">
                  Ajoutez des photos pour illustrer l'installation. Maximum 10 photos.
                </FormDescription>
              </div>

              <Separator />

              {/* NOUVELLE SECTION: Galerie de photos avant/après */}
              <div className="space-y-4 mt-4">
                <PhotoUploadSection
                  onChange={setInstallationPhotos}
                  initialPhotos={{ before: [], after: [] }}
                  maxPhotos={10}
                />
              </div>

              <Separator />

              {/* NOUVELLE SECTION: Signatures électroniques */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <FilePenLine className="h-5 w-5 mr-2 text-primary" />
                  Signatures électroniques
                </h3>

                <div className="grid grid-cols-1 gap-6">
                  {/* Informations du client */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-md">Informations du client</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="clientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom du client</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nom du client"
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
                        name="clientEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email du client (facultatif)</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="email@exemple.com"
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
                        name="clientPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone du client (facultatif)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="06 12 34 56 78"
                                {...field}
                                className="bg-gray-800 border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border border-gray-800">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              J'accepte les conditions
                            </FormLabel>
                            <FormDescription>
                              Je confirme que l'installation a été réalisée conformément aux spécifications convenues et je suis satisfait du travail effectué.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Pad de signatures */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <SignaturePad
                      label="Signature du client"
                      onSave={setClientSignature}
                      defaultValue={clientSignature}
                    />

                    <SignaturePad
                      label="Signature de l'installateur"
                      onSave={setInstallerSignature}
                      defaultValue={installerSignature}
                    />
                  </div>
                </div>
              </div>

              {/* Message de résultat */}
              {submitResult && (
                <div className={`p-4 rounded-md ${
                  submitResult.success
                    ? "bg-green-900/30 border border-green-900/50"
                    : "bg-red-900/30 border border-red-900/50"
                }`}>
                  <div className="flex items-start">
                    {submitResult.success ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    )}
                    <p className={`text-sm ${
                      submitResult.success ? "text-green-500" : "text-red-500"
                    }`}>
                      {submitResult.message}
                    </p>
                  </div>
                </div>
              )}

              {/* Boutons de formulaire */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="button-highlight button-offset"
                >
                  {isSubmitting ? "Enregistrement..." : "Enregistrer l'installation"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
