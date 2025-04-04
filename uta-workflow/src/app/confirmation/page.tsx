"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { StatusSelector } from "@/components/status-selector";
import { FileUpload } from "@/components/ui/file-upload";
import { EligibilityChecker } from "@/components/eligibility-checker";
import { AccountCreator } from "@/components/account-creator";
import { DocumentUploader } from "@/components/document-uploader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function ConfirmationPage() {
  const [activeTab, setActiveTab] = useState("documents");
  const [status, setStatus] = useState<'validated' | 'rejected' | 'no_response' | 'callback' | null>(null);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Service de Confirmation</h1>
              <Button
                variant="outline"
                className="button-highlight"
                asChild
              >
                <Link href="/dashboard/">Retour au tableau de bord</Link>
              </Button>
            </div>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Dossier de confirmation</CardTitle>
                <CardDescription>
                  Vérifiez l'éligibilité du client et complétez son dossier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="documents"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4 mb-8">
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="eligibilite">Éligibilité</TabsTrigger>
                    <TabsTrigger value="compte">Création Compte</TabsTrigger>
                    <TabsTrigger value="statut">Statut</TabsTrigger>
                  </TabsList>

                  {/* Onglet Documents */}
                  <TabsContent value="documents" className="space-y-6">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle>Documents du client</CardTitle>
                        <CardDescription>
                          Ajoutez les documents requis pour la création du dossier
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <DocumentUploader />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Onglet Éligibilité (déplacé depuis le formulaire de qualification) */}
                  <TabsContent value="eligibilite" className="space-y-6">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle>Vérification d'éligibilité</CardTitle>
                        <CardDescription>
                          Vérifiez l'éligibilité du client aux aides MaPrimeRénov' et Anah
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <EligibilityChecker />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Onglet Création Compte */}
                  <TabsContent value="compte" className="space-y-6">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle>Création de compte MaPrimeRénov'/Anah</CardTitle>
                        <CardDescription>
                          Créez un compte pour le client sur les plateformes MaPrimeRénov' et Anah
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <AccountCreator />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Onglet Statut */}
                  <TabsContent value="statut" className="space-y-6">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle>Statut du dossier</CardTitle>
                        <CardDescription>
                          Mettez à jour le statut du dossier et finalisez le traitement
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <StatusSelector
                          showDescription={true}
                          className="mt-4"
                          value={status}
                          onChange={setStatus}
                        />

                        <div className="mt-8">
                          <h3 className="text-lg font-medium mb-4">Finalisation du dossier</h3>
                          <div className="p-4 bg-gray-900 rounded-md">
                            <p className="text-sm mb-4">
                              Une fois le dossier traité, il sera transmis selon le statut sélectionné:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm">
                              <li className="text-green-400">
                                <span className="text-white">
                                  <strong>Validé</strong>: Transféré au service administratif pour gestion
                                </span>
                              </li>
                              <li className="text-red-400">
                                <span className="text-white">
                                  <strong>Annulé</strong>: Archivé comme rejeté
                                </span>
                              </li>
                              <li className="text-orange-400">
                                <span className="text-white">
                                  <strong>Ne répond pas</strong>: Conservé pour relance ultérieure
                                </span>
                              </li>
                              <li className="text-blue-400">
                                <span className="text-white">
                                  <strong>À rappeler</strong>: Noté pour suivi ultérieur
                                </span>
                              </li>
                            </ul>
                          </div>

                          <div className="mt-6 flex justify-end">
                            <Button
                              className="button-highlight button-offset"
                              disabled={!status}
                            >
                              Finaliser le dossier
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const tabs = ["documents", "eligibilite", "compte", "statut"];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex > 0) {
                      setActiveTab(tabs[currentIndex - 1]);
                    }
                  }}
                  disabled={activeTab === "documents"}
                >
                  Précédent
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    const tabs = ["documents", "eligibilite", "compte", "statut"];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1]);
                    }
                  }}
                  disabled={activeTab === "statut"}
                >
                  Suivant
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
