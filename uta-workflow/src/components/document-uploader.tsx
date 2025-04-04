"use client";

import React from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function DocumentUploader() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Documents requis</h2>
      <p className="text-sm text-gray-400">
        Ajoutez les documents suivants pour compléter le dossier du client.
      </p>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-base">Pièces d'identité</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            maxFiles={2}
            accept={{
              "application/pdf": [".pdf"],
              "image/jpeg": [".jpg", ".jpeg"],
              "image/png": [".png"],
            }}
          />
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-base">Avis d'imposition</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            maxFiles={1}
            accept={{
              "application/pdf": [".pdf"],
              "image/jpeg": [".jpg", ".jpeg"],
              "image/png": [".png"],
            }}
          />
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-base">Justificatifs de domicile</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            maxFiles={1}
            accept={{
              "application/pdf": [".pdf"],
              "image/jpeg": [".jpg", ".jpeg"],
              "image/png": [".png"],
            }}
          />
          <p className="mt-2 text-xs text-gray-400">
            Facture d'électricité, de gaz ou d'eau de moins de 3 mois
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-base">Factures énergétiques</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            maxFiles={3}
            accept={{
              "application/pdf": [".pdf"],
              "image/jpeg": [".jpg", ".jpeg"],
              "image/png": [".png"],
            }}
          />
          <p className="mt-2 text-xs text-gray-400">
            Factures d'électricité ou de gaz montrant la consommation sur une année
          </p>
        </CardContent>
      </Card>

      <Separator className="my-4" />

      <h2 className="text-xl font-semibold">Documents optionnels</h2>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-base">Devis de travaux</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            maxFiles={3}
            accept={{
              "application/pdf": [".pdf"],
              "image/jpeg": [".jpg", ".jpeg"],
              "image/png": [".png"],
            }}
          />
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-base">Autres documents</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            maxFiles={5}
            accept={{
              "application/pdf": [".pdf"],
              "image/jpeg": [".jpg", ".jpeg"],
              "image/png": [".png"],
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
              "application/msword": [".doc"],
            }}
          />
          <p className="mt-2 text-xs text-gray-400">
            Photos, diagnostics, certificats ou autres documents pertinents
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
