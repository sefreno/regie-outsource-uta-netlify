import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ClientBody } from "./ClientBody";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UTA Workflow - Rénovation Énergétique",
  description: "Application de workflow pour la gestion des projets de rénovation énergétique",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground min-h-screen flex flex-col`}>
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
