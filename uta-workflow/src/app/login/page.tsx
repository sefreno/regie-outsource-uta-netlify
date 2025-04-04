"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DEMO_ACCOUNTS = [
  { email: "qualification@uta.fr", role: "Qualification", path: "/qualification/" },
  { email: "confirmation@uta.fr", role: "Confirmation", path: "/confirmation/" },
  { email: "administrative@uta.fr", role: "Administratif", path: "/administrative/" },
  { email: "visit@uta.fr", role: "Visite Technique", path: "/technical-visit/" },
  { email: "installation@uta.fr", role: "Installation", path: "/installation/" },
  { email: "billing@uta.fr", role: "Facturation", path: "/billing/" },
  { email: "admin@uta.fr", role: "Administrateur", path: "/dashboard/" },
];

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string, path: string) => {
    setSelectedRole(role);
    setIsLoading(true);

    // Simuler un délai court avant la redirection
    setTimeout(() => {
      router.push(path);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="space-y-2 flex flex-col items-center">
          <Logo className="mb-2 h-16" />
          <CardTitle className="text-2xl text-center">Accès UTA</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Sélectionnez votre rôle pour accéder à l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 bg-blue-900/20 text-blue-400 border-blue-900">
            <AlertTitle>Mode Démonstration</AlertTitle>
            <AlertDescription>
              Cliquez sur un des rôles ci-dessous pour accéder à l'interface correspondante
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {DEMO_ACCOUNTS.map((account) => (
              <Button
                key={account.email}
                variant="outline"
                size="lg"
                className="px-3 py-5 h-auto border-gray-700 button-highlight flex flex-col"
                disabled={isLoading}
                onClick={() => handleRoleSelect(account.role, account.path)}
              >
                <span className="text-sm">{account.role}</span>
                <span className="text-xs text-gray-500 mt-1">{account.email}</span>
              </Button>
            ))}
          </div>

          {isLoading && (
            <div className="text-center py-4">
              <div className="text-green-500 text-sm">
                Connexion en tant que {selectedRole}...
              </div>
              <div className="mt-2 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 animate-pulse rounded-full"
                  style={{width: '100%'}}
                />
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center mt-6 p-3 border-t border-gray-800">
            <p>UTA Workflow - Application de démonstration</p>
            <p className="mt-1">Rénovation énergétique</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
