"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

interface ClientBodyProps {
  children: React.ReactNode;
}

export function ClientBody({ children }: ClientBodyProps) {
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, ensuring hydration issues are avoided
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ajouter la classe `js` au body pour les styles qui nécessitent JavaScript
  useEffect(() => {
    document.body.classList.add("js");
    return () => {
      document.body.classList.remove("js");
    };
  }, []);

  // Delay rendering any client components until after hydration
  if (!mounted) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
