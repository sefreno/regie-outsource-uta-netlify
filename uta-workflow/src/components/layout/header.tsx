"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export function Header() {
  // Démonstration avec un utilisateur statique
  const mockUser = {
    name: "Démo UTA",
    email: "demo@uta.fr",
    role: "admin"
  };

  const roleToLabel: Record<string, string> = {
    qualification: "Qualification",
    confirmation: "Confirmation",
    administrative: "Administratif",
    technical_visit: "Visite technique",
    installation: "Installation",
    billing: "Facturation",
    admin: "Administration",
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center">
            <Logo className="mr-2" />
            <span className="hidden md:inline text-sm text-gray-400">
              Rénovation Énergétique
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="secondary" size="sm" className="button-highlight button-offset">
            {roleToLabel[mockUser.role]}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8 border border-gray-700">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {mockUser.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{mockUser.name}</p>
                <p className="text-xs text-muted-foreground">{mockUser.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/">Mon tableau de bord</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login/" className="text-red-500 focus:text-red-500">
                  Changer de compte
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
