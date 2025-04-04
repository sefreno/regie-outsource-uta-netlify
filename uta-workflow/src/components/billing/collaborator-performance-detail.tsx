"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { formatCurrency, formatNumberWithSpaces } from "@/lib/utils";
import { type Collaborator, type BillableActivity, ServiceType } from "@/lib/billing/models";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Download,
  FileText,
  Mail,
  Minus,
  Printer,
  RefreshCcw,
  Search,
  UserCheck,
  FileSpreadsheet
} from "lucide-react";

// Couleurs pour les types de service
const serviceColors: Record<ServiceType, string> = {
  [ServiceType.TECHNICAL_VISIT]: "#3b82f6", // blue-500
  [ServiceType.INSTALLATION]: "#22c55e", // green-500
  [ServiceType.QUALIFICATION]: "#eab308", // yellow-500
  [ServiceType.CONFIRMATION]: "#a855f7", // purple-500
  [ServiceType.ADMINISTRATIVE]: "#6b7280", // gray-500
  [ServiceType.BILLING]: "#ef4444", // red-500
};

// Gérer la couleur du status
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    inProgress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };
  return colors[status] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
};

// Obtenir une icône pour représenter la tendance
const getTrendIcon = (percentage: number) => {
  if (percentage > 0) {
    return <ArrowUpRight className="h-4 w-4 text-green-500" />;
  } else if (percentage < 0) {
    return <ArrowDownRight className="h-4 w-4 text-red-500" />;
  } else {
    return <Minus className="h-4 w-4 text-gray-500" />;
  }
};

interface CollaboratorPerformanceStats {
  currentMonthAmount: number;
  previousMonthAmount: number;
  averageMonthlyAmount: number;
  totalYearToDate: number;
  currentMonthActivities: number;
  previousMonthActivities: number;
  completionRate: number;
  successRate: number;
  averageAmountPerActivity: number;
  mostProfitableDay: string;
  mostProfitableTime: string;
  performanceTrend: number; // Pourcentage d'évolution
  activities: BillableActivity[];
  monthlyData: {
    month: string;
    amount: number;
    activitiesCount: number;
  }[];
}

interface CollaboratorPerformanceDetailProps {
  collaborator: Collaborator;
  stats: CollaboratorPerformanceStats;
  onExport: (format: "csv" | "excel" | "pdf") => void;
  onSendReport: () => void;
  onRefresh: () => void;
}

export function CollaboratorPerformanceDetail({
  collaborator,
  stats,
  onExport,
  onSendReport,
  onRefresh
}: CollaboratorPerformanceDetailProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date_desc");

  // Formatter la tendance
  const trendFormatted = stats.performanceTrend > 0
    ? `+${stats.performanceTrend.toFixed(1)}%`
    : stats.performanceTrend < 0
    ? `${stats.performanceTrend.toFixed(1)}%`
    : "0%";

  const trendClass = stats.performanceTrend > 0
    ? "text-green-500"
    : stats.performanceTrend < 0
    ? "text-red-500"
    : "text-gray-500";

  // Filtrer et trier les activités
  const filteredActivities = stats.activities
    .filter(activity => {
      const matchesSearch = searchTerm === "" ||
        activity.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.details.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || activity.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date_asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date_desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "amount_asc":
          return a.amount - b.amount;
        case "amount_desc":
          return b.amount - a.amount;
        case "reference":
          return a.reference.localeCompare(b.reference);
        default:
          return 0;
      }
    });

  // Données pour le graphique d'évolution mensuelle
  const monthlyChartData = stats.monthlyData.map(data => ({
    name: data.month,
    montant: data.amount,
    activités: data.activitiesCount,
  }));

  // Données pour le graphique en camembert
  const pieChartData = [
    { name: "Complété", value: stats.completionRate, color: "#22c55e" },
    { name: "Restant", value: 100 - stats.completionRate, color: "#6b7280" },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête avec informations de base */}
      <Card className="border-gray-800">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                <CardTitle className="text-2xl font-bold">{collaborator.name}</CardTitle>
                <Badge variant="outline" className={`${getStatusColor(collaborator.active ? "completed" : "cancelled")}`}>
                  {collaborator.active ? "Actif" : "Inactif"}
                </Badge>
              </div>
              <CardDescription className="mt-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`${getStatusColor("inProgress")}`}>
                    {collaborator.email}
                  </Badge>
                  <Badge variant="outline" className={`${getStatusColor("completed")}`}>
                    {collaborator.service}
                  </Badge>
                </div>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              <Button variant="outline" size="sm" onClick={() => onExport("pdf")}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </Button>
              <Button variant="outline" size="sm" onClick={onSendReport}>
                <Mail className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-4">
                <div className="text-sm text-gray-400">Montant (mois actuel)</div>
                <div className="text-2xl font-bold mt-1">
                  {formatCurrency(stats.currentMonthAmount)}
                </div>
                <div className={`flex items-center text-sm mt-1 ${trendClass}`}>
                  {getTrendIcon(stats.performanceTrend)}
                  <span className="ml-1">{trendFormatted} vs mois précédent</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-4">
                <div className="text-sm text-gray-400">Activités (mois actuel)</div>
                <div className="text-2xl font-bold mt-1">
                  {stats.currentMonthActivities}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {stats.previousMonthActivities} le mois précédent
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-4">
                <div className="text-sm text-gray-400">Taux de complétion</div>
                <div className="text-2xl font-bold mt-1">
                  {stats.completionRate}%
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {stats.successRate}% de taux de réussite
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-4">
                <div className="text-sm text-gray-400">Total cumulé (année)</div>
                <div className="text-2xl font-bold mt-1">
                  {formatCurrency(stats.totalYearToDate)}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {formatCurrency(stats.averageMonthlyAmount)} / mois en moyenne
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Contenu principal avec onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="activities">Activités</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
        </TabsList>

        {/* Onglet Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Graphique d'évolution mensuelle */}
            <Card className="col-span-2 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">Évolution mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={monthlyChartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={serviceColors[collaborator.service]} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={serviceColors[collaborator.service]} stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                      <XAxis dataKey="name" tick={{ fill: "#888" }} />
                      <YAxis tick={{ fill: "#888" }} />
                      <Tooltip
                        formatter={(value: number, name: string) => {
                          return [
                            name === "montant" ? formatCurrency(value) : formatNumberWithSpaces(value),
                            name === "montant" ? "Montant" : "Activités"
                          ];
                        }}
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          borderColor: "#374151",
                          color: "#e5e7eb"
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="montant"
                        stroke={serviceColors[collaborator.service]}
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques et taux de complétion */}
            <Card className="border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Taux de complétion en camembert */}
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`${value}%`, "Complétion"]}
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          borderColor: "#374151",
                          color: "#e5e7eb"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Statistiques clés */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Taux de complétion</span>
                    <span className="font-medium">{stats.completionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Montant moyen</span>
                    <span className="font-medium">{formatCurrency(stats.averageAmountPerActivity)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Jour le plus productif</span>
                    <span className="font-medium">{stats.mostProfitableDay}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Horaire optimal</span>
                    <span className="font-medium">{stats.mostProfitableTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activités récentes */}
          <Card className="border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Activités récentes</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("activities")}>
                Voir toutes les activités
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.slice(0, 5).map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.reference}</TableCell>
                      <TableCell>{new Date(activity.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{formatCurrency(activity.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Activités */}
        <TabsContent value="activities" className="space-y-4">
          <Card className="border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">Liste des activités</CardTitle>
              <CardDescription>
                Toutes les activités effectuées par {collaborator.name}
              </CardDescription>

              {/* Filtres et recherche */}
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="completed">Complété</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_desc">Date (récent)</SelectItem>
                    <SelectItem value="date_asc">Date (ancien)</SelectItem>
                    <SelectItem value="amount_desc">Montant (élevé)</SelectItem>
                    <SelectItem value="amount_asc">Montant (faible)</SelectItem>
                    <SelectItem value="reference">Référence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredActivities.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  Aucune activité ne correspond à vos critères de recherche.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Référence</TableHead>
                      <TableHead className="w-[120px]">Date</TableHead>
                      <TableHead>Détails</TableHead>
                      <TableHead className="w-[120px]">Montant</TableHead>
                      <TableHead className="w-[100px]">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.reference}</TableCell>
                        <TableCell>{new Date(activity.date).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>{activity.details}</TableCell>
                        <TableCell>{formatCurrency(activity.amount)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(activity.status)}>
                            {activity.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => onExport("csv")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Exporter en CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => onExport("excel")}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Exporter en Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Analytiques */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Répartition par jour de la semaine */}
            <Card className="border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">Répartition par jour</CardTitle>
                <CardDescription>
                  Montants facturés par jour de la semaine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Lundi", value: 1200 },
                        { name: "Mardi", value: 1500 },
                        { name: "Mercredi", value: 1800 },
                        { name: "Jeudi", value: 1200 },
                        { name: "Vendredi", value: 900 },
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                      <XAxis dataKey="name" tick={{ fill: "#888" }} />
                      <YAxis tickFormatter={(value) => formatCurrency(value, { notation: 'compact' })} tick={{ fill: "#888" }} />
                      <Tooltip
                        formatter={(value: number) => [formatCurrency(value), "Montant"]}
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          borderColor: "#374151",
                          color: "#e5e7eb"
                        }}
                      />
                      <Bar dataKey="value" fill={serviceColors[collaborator.service]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Évolution du taux de complétion */}
            <Card className="border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">Taux de complétion</CardTitle>
                <CardDescription>
                  Évolution mensuelle du taux de complétion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={stats.monthlyData.map(m => ({ name: m.month, value: Math.round(Math.random() * 30) + 70 }))}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                      <XAxis dataKey="name" tick={{ fill: "#888" }} />
                      <YAxis
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                        tick={{ fill: "#888" }}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${value}%`, "Taux de complétion"]}
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          borderColor: "#374151",
                          color: "#e5e7eb"
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Calendrier d'activité */}
            <Card className="border-gray-800 col-span-full">
              <CardHeader>
                <CardTitle className="text-lg">Calendrier d'activité</CardTitle>
                <CardDescription>
                  Répartition des activités sur les 30 derniers jours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-1 py-4">
                  {Array.from({ length: 30 }).map((_, i) => {
                    // Générer un niveau d'activité aléatoire (0-4)
                    const activityLevel = Math.floor(Math.random() * 5);
                    // Déterminer la couleur en fonction du niveau d'activité
                    let bgColor;
                    switch (activityLevel) {
                      case 0: bgColor = "bg-gray-800"; break;
                      case 1: bgColor = "bg-green-900/50"; break;
                      case 2: bgColor = "bg-green-800/70"; break;
                      case 3: bgColor = "bg-green-700/80"; break;
                      case 4: bgColor = "bg-green-600"; break;
                      default: bgColor = "bg-gray-800";
                    }

                    return (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-sm ${bgColor} cursor-pointer`}
                        title={`${activityLevel} activités le ${new Date(2025, 3, i+1).toLocaleDateString('fr-FR')}`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <div>Moins</div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-sm bg-gray-800" />
                    <div className="w-3 h-3 rounded-sm bg-green-900/50" />
                    <div className="w-3 h-3 rounded-sm bg-green-800/70" />
                    <div className="w-3 h-3 rounded-sm bg-green-700/80" />
                    <div className="w-3 h-3 rounded-sm bg-green-600" />
                  </div>
                  <div>Plus</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
