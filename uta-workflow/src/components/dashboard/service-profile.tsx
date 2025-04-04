"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Mail,
  Phone,
  Award,
  BarChart3,
  Calendar,
  ClipboardList,
  Clock,
  Save,
  Settings,
  Lock,
  AlertCircle
} from "lucide-react";

interface ServiceProfileProps {
  serviceName: string;
  serviceRoute: string;
  userProfile: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    role: string;
    joinDate: string;
  };
  performanceStats: {
    dossiersCount: number;
    completedCount: number;
    pendingCount: number;
    rejectedCount: number;
    averageProcessingTime: string;
  };
}

export function ServiceProfile({
  serviceName,
  serviceRoute,
  userProfile,
  performanceStats,
}: ServiceProfileProps) {
  const completionRate = performanceStats.dossiersCount > 0
    ? (performanceStats.completedCount / performanceStats.dossiersCount) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{serviceName} - Mon profil</h1>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="button-highlight"
            asChild
          >
            <Link href={serviceRoute}>Tableau de bord</Link>
          </Button>
          <Button
            className="button-highlight button-offset"
            asChild
          >
            <Link href="/dashboard/">Tableau de bord global</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gray-900 border-gray-800 md:col-span-1">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-4">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src={userProfile.avatar} />
              <AvatarFallback className="text-3xl">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            <h2 className="text-xl font-bold">{userProfile.name}</h2>
            <Badge variant="outline" className="mt-1 border-primary-600 text-primary bg-primary-900/20">
              {userProfile.role}
            </Badge>

            <div className="w-full mt-6 space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm">{userProfile.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm">{userProfile.phone}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm">A rejoint le {userProfile.joinDate}</span>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="w-full">
              <h3 className="font-medium mb-3">Accès aux services</h3>
              <div className="space-y-2">
                {Object.entries(servicePaths).map(([key, { path, label }]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm">{label}</span>
                    <Badge
                      variant="outline"
                      className={key === getServiceKey(serviceRoute)
                        ? "border-green-700 text-green-500"
                        : "border-gray-700 text-gray-400"}
                    >
                      {key === getServiceKey(serviceRoute) ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 md:col-span-2">
          <CardHeader>
            <Tabs defaultValue="performance">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="settings">Paramètres</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="performance" className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <ClipboardList className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{performanceStats.dossiersCount}</div>
                  <p className="text-xs text-gray-400">Dossiers traités</p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
                  <p className="text-xs text-gray-400">Taux de complétion</p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-bold">{performanceStats.averageProcessingTime}</div>
                  <p className="text-xs text-gray-400">Temps moyen</p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <Award className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">A+</div>
                  <p className="text-xs text-gray-400">Niveau de qualité</p>
                </div>
              </div>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-base">Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityItems.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-700 last:border-0 last:pb-0">
                        <div className={`mt-0.5 w-2 h-2 rounded-full ${getActivityColor(item.type)}`}></div>
                        <div>
                          <p className="text-sm">{item.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-base">Progression des objectifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Objectif dossiers mensuels</span>
                        <span className="text-sm font-medium">15/20</span>
                      </div>
                      <Progress value={75} className="h-2 bg-gray-700">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600" />
                      </Progress>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Temps moyen par dossier</span>
                        <span className="text-sm font-medium">3.2j/3.5j</span>
                      </div>
                      <Progress value={92} className="h-2 bg-gray-700">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-600" />
                      </Progress>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Taux de satisfaction client</span>
                        <span className="text-sm font-medium">88%/90%</span>
                      </div>
                      <Progress value={88} className="h-2 bg-gray-700">
                        <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600" />
                      </Progress>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input id="name" defaultValue={userProfile.name} className="bg-gray-800 border-gray-700" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <Input id="email" defaultValue={userProfile.email} className="bg-gray-800 border-gray-700" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" defaultValue={userProfile.phone} className="bg-gray-800 border-gray-700" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    className="bg-gray-800 border-gray-700 min-h-[100px]"
                    placeholder="Dites quelque chose à propos de vous..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notifications">Préférences de notification</Label>
                  <div className="rounded-md border border-gray-700 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Notifications par email</span>
                      <div className="relative inline-flex h-6 w-12 items-center rounded-full bg-gray-700">
                        <span className="absolute left-1 h-4 w-4 rounded-full bg-white transition"></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Notifications in-app</span>
                      <div className="relative inline-flex h-6 w-12 items-center rounded-full bg-gray-700">
                        <span className="absolute left-7 h-4 w-4 rounded-full bg-primary transition"></span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="mt-6 button-highlight">
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer les changements
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mot de passe actuel</Label>
                  <Input id="current-password" type="password" className="bg-gray-800 border-gray-700" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input id="new-password" type="password" className="bg-gray-800 border-gray-700" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input id="confirm-password" type="password" className="bg-gray-800 border-gray-700" />
                </div>

                <div className="rounded-md bg-gray-800 border border-gray-700 p-4 mt-6">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium">Informations de sécurité</h4>
                      <p className="text-sm text-gray-400 mt-1">
                        Votre dernier accès était le 12/04/2023 à 15:32. Si vous n'êtes pas à l'origine de cette connexion, veuillez contacter l'administration.
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="mt-2 button-highlight">
                  <Lock className="h-4 w-4 mr-2" />
                  Mettre à jour le mot de passe
                </Button>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Données d'exemple pour l'activité récente
const activityItems = [
  {
    type: "dossier_completed",
    description: "Dossier #12345 complété avec succès",
    date: "Aujourd'hui à 14:23"
  },
  {
    type: "dossier_processed",
    description: "Nouveau dossier #12350 assigné",
    date: "Aujourd'hui à 10:45"
  },
  {
    type: "achievement",
    description: "Objectif mensuel de dossiers traités atteint à 75%",
    date: "Hier à 16:30"
  },
  {
    type: "system",
    description: "Maintenance système programmée pour demain, 22:00",
    date: "Hier à 09:15"
  },
  {
    type: "dossier_rejected",
    description: "Dossier #12333 rejeté pour documents manquants",
    date: "15/04/2023"
  },
];

function getActivityColor(type: string): string {
  switch (type) {
    case "dossier_completed":
      return "bg-green-500";
    case "dossier_processed":
      return "bg-blue-500";
    case "dossier_rejected":
      return "bg-red-500";
    case "achievement":
      return "bg-purple-500";
    case "system":
    default:
      return "bg-gray-500";
  }
}

// Mapping des chemins de service
const servicePaths = {
  qualification: { path: "/qualification", label: "Qualification" },
  confirmation: { path: "/confirmation", label: "Confirmation" },
  administrative: { path: "/administrative", label: "Gestion administrative" },
  technical_visit: { path: "/technical-visit", label: "Visite technique" },
  installation: { path: "/installation", label: "Installation" },
  billing: { path: "/billing", label: "Facturation" },
};

function getServiceKey(route: string): string {
  for (const [key, { path }] of Object.entries(servicePaths)) {
    if (route.startsWith(path)) {
      return key;
    }
  }
  return "";
}
