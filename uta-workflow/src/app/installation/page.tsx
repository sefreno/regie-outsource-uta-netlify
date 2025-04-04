"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InstallationRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/installation/dashboard");
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <p className="text-gray-400">Redirection vers le tableau de bord...</p>
    </div>
  );
}
