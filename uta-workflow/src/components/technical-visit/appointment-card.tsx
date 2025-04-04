"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Mail,
  Home,
  ChevronDown,
  ChevronUp,
  Edit,
  Save,
  X,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface ClientInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  propertyType: string;
  propertySize: string;
  renovationType: string;
  administrativeNotes?: string;
}

interface AppointmentCardProps {
  id: string;
  client: ClientInfo;
  date: string;
  time: string;
  status: 'pending' | 'completed' | 'rescheduled' | 'cancelled';
  onReschedule: (id: string, newDate: string, newTime: string) => void;
}

export function AppointmentCard({
  id,
  client,
  date,
  time,
  status,
  onReschedule
}: AppointmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newDate, setNewDate] = useState(date);
  const [newTime, setNewTime] = useState(time);

  const handleReschedule = () => {
    onReschedule(id, newDate, newTime);
    setIsEditing(false);
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed': return "bg-green-500/10 text-green-500 border-green-900/50";
      case 'pending': return "bg-yellow-500/10 text-yellow-500 border-yellow-900/50";
      case 'rescheduled': return "bg-blue-500/10 text-blue-500 border-blue-900/50";
      case 'cancelled': return "bg-red-500/10 text-red-500 border-red-900/50";
      default: return "bg-gray-500/10 text-gray-500 border-gray-900/50";
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden transition-all duration-200 hover:border-gray-700">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg flex items-center">
              <User className="h-4 w-4 mr-2" />
              {client.name}
            </h3>
            <p className="text-gray-400 text-sm flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-2" />
              {client.address}
            </p>
          </div>

          <Badge className={`${getStatusColor()} py-1 px-3`}>
            {status === 'completed' && "Terminée"}
            {status === 'pending' && "En attente"}
            {status === 'rescheduled' && "Reportée"}
            {status === 'cancelled' && "Annulée"}
          </Badge>
        </div>

        <div className="flex items-center mt-3 text-sm">
          <div className="flex items-center mr-4">
            <Calendar className="h-4 w-4 mr-1 text-primary" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-primary" />
            <span>{time}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-100"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Moins de détails
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Plus de détails
              </>
            )}
          </Button>

          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-blue-500 border-blue-900/50 hover:border-blue-700">
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800">
                <DialogHeader>
                  <DialogTitle>Modifier le rendez-vous</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="appointment-date">Date du rendez-vous</Label>
                    <Input
                      id="appointment-date"
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appointment-time">Heure du rendez-vous</Label>
                    <Input
                      id="appointment-time"
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-1" />
                    Annuler
                  </Button>
                  <Button type="button" onClick={handleReschedule}>
                    <Save className="h-4 w-4 mr-1" />
                    Enregistrer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="default"
              size="sm"
              asChild
            >
              <Link href={`/technical-visit/appointment/${id}`}>
                <FileText className="h-4 w-4 mr-1" />
                Questionnaire
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-gray-800 mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Coordonnées client</h4>
              <div className="space-y-2 text-sm">
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  {client.phone}
                </p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  {client.email}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Informations logement</h4>
              <div className="space-y-2 text-sm">
                <p className="flex items-center">
                  <Home className="h-4 w-4 mr-2 text-gray-400" />
                  {client.propertyType} • {client.propertySize} m²
                </p>
                <p className="flex items-start">
                  <span className="font-medium mr-2">Type de rénovation:</span>
                  {client.renovationType}
                </p>
              </div>
            </div>
          </div>

          {client.administrativeNotes && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Notes administratives</h4>
                <p className="text-sm bg-gray-800 p-3 rounded-md border border-gray-700">
                  {client.administrativeNotes}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
