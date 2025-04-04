"use client";

import type React from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { AuthProvider } from "@/lib/auth-context";
import { DossierProvider } from "@/lib/dossier-context";
import { Toaster } from "sonner";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <AuthProvider>
      <DossierProvider>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
        <Toaster richColors closeButton position="top-right" theme="dark" />
      </DossierProvider>
    </AuthProvider>
  );
}
