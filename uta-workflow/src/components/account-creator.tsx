"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, InfoIcon, Mail } from "lucide-react";

// Schema pour la création de compte
const accountSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom est requis" }),
  lastName: z.string().min(2, { message: "Le nom est requis" }),
  email: z.string().email({ message: "Email invalide" }),
  phoneNumber: z.string().min(10, { message: "Numéro de téléphone invalide" }),
  password: z
    .string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une majuscule" })
    .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" })
    .regex(/[^a-zA-Z0-9]/, { message: "Le mot de passe doit contenir au moins un caractère spécial" }),
  confirmPassword: z.string(),
  createMprAccount: z.boolean().default(true),
  createAnahAccount: z.boolean().default(true),
  saveCredentials: z.boolean().default(true),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type AccountFormValues = z.infer<typeof accountSchema>;

export function AccountCreator() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountCreated, setAccountCreated] = useState<{
    mpr?: boolean;
    anah?: boolean;
    mprReference?: string;
    anahReference?: string;
  } | null>(null);

  // Initialisation du formulaire
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      createMprAccount: true,
      createAnahAccount: true,
      saveCredentials: true,
    },
  });

  const createAccounts = async (data: AccountFormValues) => {
    setIsSubmitting(true);

    try {
      // Simulation du temps de création des comptes
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Génération de références fictives pour les comptes
      const mprReference = data.createMprAccount ? `MPR-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}` : undefined;
      const anahReference = data.createAnahAccount ? `ANAH-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}` : undefined;

      setAccountCreated({
        mpr: data.createMprAccount,
        anah: data.createAnahAccount,
        mprReference,
        anahReference
      });

    } catch (error) {
      console.error("Erreur lors de la création des comptes:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createAccounts)} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Informations du compte</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Jean"
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
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Dupont"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="jean.dupont@example.com"
                        {...field}
                        className="bg-gray-800 border-gray-700"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      L'email sera utilisé comme identifiant pour les comptes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0612345678"
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

          <Separator className="my-6" />

          <div>
            <h3 className="text-lg font-medium mb-4">Mot de passe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                        className="bg-gray-800 border-gray-700"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Min. 8 caractères avec majuscule, chiffre et caractère spécial
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
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

          <Separator className="my-6" />

          <div>
            <h3 className="text-lg font-medium mb-4">Options</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="createMprAccount"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border border-gray-700">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Créer un compte MaPrimeRénov'</FormLabel>
                      <FormDescription>
                        Créer un compte sur la plateforme MaPrimeRénov' pour le client
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="createAnahAccount"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border border-gray-700">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Créer un compte Anah</FormLabel>
                      <FormDescription>
                        Créer un compte sur la plateforme de l'Anah pour le client
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="saveCredentials"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border border-gray-700">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Enregistrer les identifiants</FormLabel>
                      <FormDescription>
                        Enregistrer les identifiants dans le dossier du client
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              className="button-highlight button-offset"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Création en cours..." : "Créer les comptes"}
            </Button>
          </div>

          {accountCreated && (
            <div className="p-4 bg-green-900/30 border border-green-900/50 rounded-md mt-6">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-400">Comptes créés avec succès</h4>
                  <p className="text-sm text-green-400 mt-1">
                    {accountCreated.mpr && accountCreated.anah
                      ? "Les comptes MaPrimeRénov' et Anah ont été créés."
                      : accountCreated.mpr
                        ? "Le compte MaPrimeRénov' a été créé."
                        : "Le compte Anah a été créé."}
                  </p>

                  <div className="mt-4 space-y-2">
                    {accountCreated.mpr && accountCreated.mprReference && (
                      <div className="p-3 bg-gray-800 rounded-md">
                        <p className="text-sm font-medium">Compte MaPrimeRénov'</p>
                        <div className="flex items-center mt-1">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" />
                          <p className="text-sm">Identifiant: {form.getValues("email")}</p>
                        </div>
                        <p className="text-sm mt-1">Référence: {accountCreated.mprReference}</p>
                        <div className="flex items-center mt-2">
                          <InfoIcon className="h-4 w-4 mr-1 text-blue-400" />
                          <p className="text-xs text-blue-400">Un email d'activation a été envoyé au client</p>
                        </div>
                      </div>
                    )}

                    {accountCreated.anah && accountCreated.anahReference && (
                      <div className="p-3 bg-gray-800 rounded-md">
                        <p className="text-sm font-medium">Compte Anah</p>
                        <div className="flex items-center mt-1">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" />
                          <p className="text-sm">Identifiant: {form.getValues("email")}</p>
                        </div>
                        <p className="text-sm mt-1">Référence: {accountCreated.anahReference}</p>
                        <div className="flex items-center mt-2">
                          <InfoIcon className="h-4 w-4 mr-1 text-blue-400" />
                          <p className="text-xs text-blue-400">Un email d'activation a été envoyé au client</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
