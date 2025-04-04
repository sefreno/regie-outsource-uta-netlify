"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Users,
  ClipboardList,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock as ClockIcon
} from "lucide-react";

interface ServiceDashboardProps {
  serviceName: string;
  serviceRoute: string;
  stats: {
    total: number;
    completed: number;
    pending: number;
    rejected: number;
  };
  recentDossiers: Array<{
    id: string;
    client: string;
    address: string;
    date: string;
    status: 'pending' | 'completed' | 'rejected' | 'callback';
  }>;
  userStats?: {
    name: string;
    processedCount: number;
    completedCount: number;
    avatar?: string;
  }[];
}

export function ServiceDashboard({
  serviceName,
  serviceRoute,
  stats,
  recentDossiers,
  userStats = [],
}: ServiceDashboardProps) {
  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  const rejectionRate = stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0;
  const pendingRate = stats.total > 0 ? (stats.pending / stats.total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{serviceName} - Tableau de bord</h1>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="button-highlight"
            asChild
          >
            <Link href={`${serviceRoute}/profile`}>Mon profil</Link>
          </Button>
          <Button
            className="button-highlight button-offset"
            asChild
          >
            <Link href="/dashboard/">Tableau de bord global</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-sm font-medium">Dossiers totaux</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-400 mt-1">Tous les dossiers traités</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-sm font-medium">Complétés</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <div className="mt-2">
              <Progress value={completionRate} className="h-2 bg-gray-800">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-600" />
              </Progress>
              <p className="text-xs text-gray-400 mt-1">{Math.round(completionRate)}% de taux de complétion</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <ClockIcon className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <div className="mt-2">
              <Progress value={pendingRate} className="h-2 bg-gray-800">
                <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600" />
              </Progress>
              <p className="text-xs text-gray-400 mt-1">{stats.pending} dossiers en attente de traitement</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-sm font-medium">Rejetés</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <div className="mt-2">
              <Progress value={rejectionRate} className="h-2 bg-gray-800">
                <div className="h-full bg-gradient-to-r from-red-500 to-red-600" />
              </Progress>
              <p className="text-xs text-gray-400 mt-1">{Math.round(rejectionRate)}% de taux de rejet</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="recent">Dossiers récents</TabsTrigger>
          <TabsTrigger value="performance">Performance de l'équipe</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Dossiers récents</CardTitle>
              <CardDescription>
                Les derniers dossiers traités par votre service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDossiers.length > 0 ? (
                  recentDossiers.map((dossier) => (
                    <div key={dossier.id} className="flex items-center justify-between p-3 border border-gray-800 rounded-md hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <StatusIcon status={dossier.status} />
                        <div>
                          <p className="font-medium">{dossier.client}</p>
                          <p className="text-sm text-gray-400">{dossier.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <Badge
                            variant="outline"
                            className={`
                              ${dossier.status === 'completed' ? 'border-green-700 text-green-500' : ''}
                              ${dossier.status === 'pending' ? 'border-yellow-700 text-yellow-500' : ''}
                              ${dossier.status === 'rejected' ? 'border-red-700 text-red-500' : ''}
                              ${dossier.status === 'callback' ? 'border-blue-700 text-blue-500' : ''}
                            `}
                          >
                            {dossier.status === 'completed' && "Complété"}
                            {dossier.status === 'pending' && "En attente"}
                            {dossier.status === 'rejected' && "Rejeté"}
                            {dossier.status === 'callback' && "À rappeler"}
                          </Badge>
                          <p className="text-xs text-gray-400 mt-1">{dossier.date}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 button-highlight"
                          asChild
                        >
                          <Link href={`${serviceRoute}/dossier/${dossier.id}`}>
                            Voir
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    <ClipboardList className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>Aucun dossier récent</p>
                  </div>
                )}
              </div>
              {recentDossiers.length > 0 && (
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    className="button-highlight"
                    asChild
                  >
                    <Link href={`${serviceRoute}/dossiers`}>
                      Voir tous les dossiers
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Performance de l'équipe</CardTitle>
              <CardDescription>
                Activité des utilisateurs dans le service {serviceName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userStats.length > 0 ? (
                <div className="space-y-4">
                  {userStats.map((user, index) => (
                    <div key={index} className="p-3 border border-gray-800 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-400">
                              {user.processedCount} dossiers traités
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{user.completedCount} complétés</p>
                          <Progress
                            value={user.processedCount > 0 ? (user.completedCount / user.processedCount) * 100 : 0}
                            className="h-2 w-24 bg-gray-800 mt-1"
                          >
                            <div className="h-full bg-gradient-to-r from-green-500 to-green-600" />
                          </Progress>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>Aucune donnée de performance disponible</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Calendrier des rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-gray-400">
              <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>Aucun rendez-vous programmé</p>
              <Button variant="outline" className="mt-4 button-highlight">
                Voir le calendrier
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Temps de traitement moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="relative w-24 h-24 mx-auto">
                <Clock className="h-16 w-16 mx-auto text-gray-400" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-2xl font-bold">3.2<span className="text-sm font-normal">j</span></div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">Délai moyen de traitement des dossiers</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'rejected':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'callback':
      return <Clock className="h-5 w-5 text-blue-500" />;
    case 'pending':
    default:
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  }
}
