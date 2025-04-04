"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TechnicalVisitRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/technical-visit/dashboard");
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <p className="text-gray-400">Redirection vers le tableau de bord...</p>
    </div>
  );
}
