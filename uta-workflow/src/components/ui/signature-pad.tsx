"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Save, Check } from "lucide-react";

interface SignaturePadProps {
  width?: number;
  height?: number;
  label: string;
  onSave: (signatureDataUrl: string) => void;
  defaultValue?: string;
  className?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  width = 300,
  height = 150,
  label,
  onSave,
  defaultValue = "",
  className = "",
}) => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isSigned, setIsSigned] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [signatureData, setSignatureData] = useState<string>(defaultValue);

  // Effet pour charger une signature existante si présente
  useEffect(() => {
    if (defaultValue && sigCanvas.current) {
      // Créer une image à partir de l'URL des données
      const img = new Image();
      img.onload = () => {
        const ctx = sigCanvas.current?.getCanvas().getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          setIsSigned(true);
          setIsSaved(true);
        }
      };
      img.src = defaultValue;
    }
  }, [defaultValue]);

  // Gérer le début de la signature
  const handleBegin = () => {
    setIsSaved(false);
  };

  // Gérer la fin de la signature
  const handleEnd = () => {
    setIsSigned(!sigCanvas.current?.isEmpty());
  };

  // Effacer la signature
  const clearSignature = () => {
    sigCanvas.current?.clear();
    setIsSigned(false);
    setIsSaved(false);
    setSignatureData("");
  };

  // Enregistrer la signature
  const saveSignature = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataURL = sigCanvas.current.toDataURL("image/png");
      setSignatureData(dataURL);
      onSave(dataURL);
      setIsSaved(true);
    }
  };

  return (
    <Card className={`${className} border-gray-800 bg-gray-900`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 rounded-md overflow-hidden ${
            isSigned ? "border-primary" : "border-gray-700"
          }`}
          style={{ touchAction: "none" }}
        >
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              width,
              height,
              className: "bg-gray-800",
            }}
            onBegin={handleBegin}
            onEnd={handleEnd}
            backgroundColor="rgba(31, 31, 31, 0)"
            penColor="white"
          />
        </div>
        {signatureData && isSaved && (
          <div className="mt-2 flex items-center text-xs text-green-500">
            <Check className="h-3 w-3 mr-1" /> Signature enregistrée
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-2 pt-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearSignature}
          className="w-1/2"
        >
          <RefreshCw className="h-4 w-4 mr-1" /> Effacer
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={saveSignature}
          disabled={!isSigned || isSaved}
          className="w-1/2 button-highlight"
        >
          <Save className="h-4 w-4 mr-1" /> Enregistrer
        </Button>
      </CardFooter>
    </Card>
  );
};
