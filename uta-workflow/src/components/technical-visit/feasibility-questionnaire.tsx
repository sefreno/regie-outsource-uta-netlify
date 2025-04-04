"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
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
import { AlertCircle, CheckCircle2, Camera } from "lucide-react";

// Schéma du questionnaire avec validation
const questionnaireSchema = z.object({
  // Informations générales
  inspectionDate: z.string(),
  inspector: z.string(),

  // Contexte de la rénovation
  renovationType: z.string(),
  currentState: z.string(),

  // Informations techniques
  powerSupply: z.enum(["single_phase", "three_phase"]),
  electricalPanel: z.enum(["compatible", "upgrade_needed", "unknown"]),
  wallType: z.string(),
  ceilingHeight: z.string(),
  floorType: z.string(),

  // Conditions spécifiques
  accessConditions: z.string(),
  spaceConstraints: z.string(),

  // Présence d'obstacles
  obstacles: z.array(z.string()).optional(),
  otherObstacles: z.string().optional(),

  // Environnement
  environmentalConstraints: z.enum(["none", "minor", "major"]),
  environmentalDetails: z.string().optional(),

  // Faisabilité technique
  technicalFeasibility: z.enum(["feasible", "conditional", "not_feasible"]),

  // Contraintes identifiées
  identifiedConstraints: z.string().optional(),

  // Solutions proposées
  proposedSolutions: z.string().optional(),

  // Coûts additionnels
  additionalCosts: z.boolean(),
  additionalCostsDetails: z.string().optional(),
  estimatedAdditionalCost: z.string().optional(),

  // Conclusion
  conclusion: z.string(),

  // Recommandations spécifiques
  specificRecommendations: z.string().optional(),
});

type QuestionnaireValues = z.infer<typeof questionnaireSchema>;

interface FeasibilityQuestionnaireProps {
  clientName: string;
  propertyAddress: string;
  appointmentId: string;
  renovationType: string;
  onSubmit: (data: QuestionnaireValues, photos: FileWithPreview[]) => void;
  initialData?: Partial<QuestionnaireValues>;
}

export type FileWithPreview = File & {
  preview?: string;
};

export function FeasibilityQuestionnaire({
  clientName,
  propertyAddress,
  appointmentId,
  renovationType,
  onSubmit,
  initialData = {},
}: FeasibilityQuestionnaireProps) {
  const [photos, setPhotos] = useState<FileWithPreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Récupérer la date du jour pour le champ date d'inspection
  const today = new Date().toISOString().split("T")[0];

  // Initialisation du formulaire avec les valeurs par défaut ou les données existantes
  const form = useForm<QuestionnaireValues>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      inspectionDate: initialData.inspectionDate || today,
      inspector: initialData.inspector || "",
      renovationType: initialData.renovationType || renovationType,
      currentState: initialData.currentState || "",
      powerSupply: initialData.powerSupply || "single_phase",
      electricalPanel: initialData.electricalPanel || "unknown",
      wallType: initialData.wallType || "",
      ceilingHeight: initialData.ceilingHeight || "",
      floorType: initialData.floorType || "",
      accessConditions: initialData.accessConditions || "",
      spaceConstraints: initialData.spaceConstraints || "",
      obstacles: initialData.obstacles || [],
      otherObstacles: initialData.otherObstacles || "",
      environmentalConstraints: initialData.environmentalConstraints || "none",
      environmentalDetails: initialData.environmentalDetails || "",
      technicalFeasibility: initialData.technicalFeasibility || "feasible",
      identifiedConstraints: initialData.identifiedConstraints || "",
      proposedSolutions: initialData.proposedSolutions || "",
      additionalCosts: initialData.additionalCosts || false,
      additionalCostsDetails: initialData.additionalCostsDetails || "",
      estimatedAdditionalCost: initialData.estimatedAdditionalCost || "",
      conclusion: initialData.conclusion || "",
      specificRecommendations: initialData.specificRecommendations || "",
    },
  });

  // Gérer la soumission du formulaire
  const handleSubmit = async (values: QuestionnaireValues) => {
    setIsSubmitting(true);
    try {
      // Simulation d'un temps de traitement
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Appeler la fonction onSubmit du parent
      onSubmit(values, photos);

      // Afficher un message de succès
      setSubmitResult({
        success: true,
        message: "Le questionnaire a été enregistré avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la soumission du questionnaire:", error);
      setSubmitResult({
        success: false,
        message: "Une erreur est survenue lors de l'enregistrement du questionnaire."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Questionnaire de faisabilité technique</CardTitle>
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
                    name="inspectionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date d'inspection</FormLabel>
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
                    name="inspector"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du technicien</FormLabel>
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

              {/* Section: Contexte de la rénovation */}
              <div>
                <h3 className="text-lg font-medium mb-4">Contexte de la rénovation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="renovationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de rénovation</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Isolation des combles"
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
                    name="currentState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>État actuel du logement</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Description de l'état actuel..."
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

                  <FormField
                    control={form.control}
                    name="wallType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de murs</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Parpaing, brique, béton..."
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
                    name="ceilingHeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hauteur sous plafond</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="2.50m"
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
                    name="floorType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de sol</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Carrelage, parquet, béton..."
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

              {/* Section: Environnement */}
              <div>
                <h3 className="text-lg font-medium mb-4">Contraintes environnementales</h3>
                <FormField
                  control={form.control}
                  name="environmentalConstraints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveau de contraintes environnementales</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="none" id="env-none" />
                            <Label htmlFor="env-none">Aucune contrainte</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="minor" id="env-minor" />
                            <Label htmlFor="env-minor">Contraintes mineures</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="major" id="env-major" />
                            <Label htmlFor="env-major">Contraintes majeures</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="environmentalDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Détails des contraintes environnementales</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Précisez les contraintes environnementales..."
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

              {/* Section: Conclusions techniques */}
              <div>
                <h3 className="text-lg font-medium mb-4">Conclusions techniques</h3>

                <FormField
                  control={form.control}
                  name="technicalFeasibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Faisabilité technique</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="feasible" id="feasible" />
                            <Label htmlFor="feasible" className="text-green-500">Réalisable sans contrainte particulière</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="conditional" id="conditional" />
                            <Label htmlFor="conditional" className="text-yellow-500">Réalisable sous conditions</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="not_feasible" id="not_feasible" />
                            <Label htmlFor="not_feasible" className="text-red-500">Non réalisable en l'état actuel</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="identifiedConstraints"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraintes identifiées</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Listez les contraintes identifiées..."
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
                    name="proposedSolutions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Solutions proposées</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Détaillez les solutions proposées..."
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

              {/* Section: Conclusion et recommandations */}
              <div>
                <h3 className="text-lg font-medium mb-4">Conclusion et recommandations</h3>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="conclusion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conclusion générale</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Conclusion générale de la visite technique..."
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
                    name="specificRecommendations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recommandations spécifiques</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Recommandations spécifiques pour le projet..."
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
                  Ajoutez des photos pour illustrer le rapport de visite technique. Maximum 10 photos.
                </FormDescription>
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
                  {isSubmitting ? "Enregistrement..." : "Enregistrer le rapport"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
