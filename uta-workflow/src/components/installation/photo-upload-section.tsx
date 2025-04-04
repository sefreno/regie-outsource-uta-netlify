"use client";

import React, { useState, useEffect } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { PhotoGallery, type PhotoType } from "@/components/ui/photo-gallery";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Camera, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FileWithPreview } from "@/components/installation/installation-form";

interface PhotoUploadSectionProps {
  maxPhotos?: number;
  onChange: (photos: {
    before: FileWithPreview[];
    after: FileWithPreview[];
  }) => void;
  initialPhotos?: {
    before: FileWithPreview[];
    after: FileWithPreview[];
  };
}

export function PhotoUploadSection({
  maxPhotos = 10,
  onChange,
  initialPhotos = { before: [], after: [] },
}: PhotoUploadSectionProps) {
  const [beforePhotos, setBeforePhotos] = useState<FileWithPreview[]>(initialPhotos.before);
  const [afterPhotos, setAfterPhotos] = useState<FileWithPreview[]>(initialPhotos.after);
  const [activeTab, setActiveTab] = useState<string>("before");

  // Convertir les FileWithPreview en PhotoType pour la galerie
  const convertToPhotoType = (files: FileWithPreview[]): PhotoType[] => {
    return files.map((file, index) => ({
      id: file.name + "-" + index,
      url: URL.createObjectURL(file),
      preview: file.preview,
      caption: file.name,
      createdAt: new Date(),
      category: activeTab === "before" ? "Avant installation" : "Après installation",
    }));
  };

  const handleBeforePhotosChange = (files: FileWithPreview[]) => {
    setBeforePhotos(files);
    onChange({ before: files, after: afterPhotos });
  };

  const handleAfterPhotosChange = (files: FileWithPreview[]) => {
    setAfterPhotos(files);
    onChange({ before: beforePhotos, after: files });
  };

  const handleRemoveBeforePhoto = (photoId: string) => {
    const updatedPhotos = beforePhotos.filter((photo, index) =>
      photoId !== photo.name + "-" + index
    );
    setBeforePhotos(updatedPhotos);
    onChange({ before: updatedPhotos, after: afterPhotos });
  };

  const handleRemoveAfterPhoto = (photoId: string) => {
    const updatedPhotos = afterPhotos.filter((photo, index) =>
      photoId !== photo.name + "-" + index
    );
    setAfterPhotos(updatedPhotos);
    onChange({ before: beforePhotos, after: updatedPhotos });
  };

  // Changement d'onglet
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Camera className="h-5 w-5 mr-2 text-primary" />
            <CardTitle>Photos d'installation</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab(activeTab === "before" ? "after" : "before")}
          >
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            {activeTab === "before" ? "Voir Après" : "Voir Avant"}
          </Button>
        </div>
        <CardDescription>
          Ajoutez des photos avant et après l'installation pour documenter les changements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="before">Avant Installation</TabsTrigger>
            <TabsTrigger value="after">Après Installation</TabsTrigger>
          </TabsList>

          <TabsContent value="before" className="space-y-4">
            <PhotoGallery
              photos={convertToPhotoType(beforePhotos)}
              title={`Photos Avant Installation (${beforePhotos.length}/${maxPhotos})`}
              emptyMessage="Aucune photo avant installation. Ajoutez des photos pour documenter l'état initial."
              onRemove={handleRemoveBeforePhoto}
              maximumPhotos={maxPhotos}
            />
            <div className="pt-2">
              <FileUpload
                value={beforePhotos}
                onChange={handleBeforePhotosChange}
                maxFiles={maxPhotos}
                accept={{
                  "image/jpeg": [".jpg", ".jpeg"],
                  "image/png": [".png"],
                }}
                maxSize={5 * 1024 * 1024} // 5MB
                dropzoneOptions={{
                  accept: {
                    "image/jpeg": [".jpg", ".jpeg"],
                    "image/png": [".png"],
                  },
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="after" className="space-y-4">
            <PhotoGallery
              photos={convertToPhotoType(afterPhotos)}
              title={`Photos Après Installation (${afterPhotos.length}/${maxPhotos})`}
              emptyMessage="Aucune photo après installation. Ajoutez des photos pour montrer le résultat final."
              onRemove={handleRemoveAfterPhoto}
              maximumPhotos={maxPhotos}
            />
            <div className="pt-2">
              <FileUpload
                value={afterPhotos}
                onChange={handleAfterPhotosChange}
                maxFiles={maxPhotos}
                accept={{
                  "image/jpeg": [".jpg", ".jpeg"],
                  "image/png": [".png"],
                }}
                maxSize={5 * 1024 * 1024} // 5MB
                dropzoneOptions={{
                  accept: {
                    "image/jpeg": [".jpg", ".jpeg"],
                    "image/png": [".png"],
                  },
                }}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 border-t border-gray-800 pt-4 text-sm text-gray-400">
          <p>Conseil: Prenez des photos sous le même angle pour faciliter la comparaison avant/après.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Maximum {maxPhotos} photos par section</li>
            <li>Formats acceptés: JPG, JPEG, PNG</li>
            <li>Taille maximum: 5MB par photo</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
