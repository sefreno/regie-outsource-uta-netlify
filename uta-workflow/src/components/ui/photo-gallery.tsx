"use client";

import type React from "react";
import { useState } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type PhotoType = {
  id: string;
  url: string;
  preview?: string;
  caption?: string;
  createdAt?: Date;
  location?: string;
  category?: string;
};

interface PhotoGalleryProps {
  photos: PhotoType[];
  title?: string;
  emptyMessage?: string;
  onRemove?: (photoId: string) => void;
  className?: string;
  maximumPhotos?: number;
}

export function PhotoGallery({
  photos,
  title = "Photos",
  emptyMessage = "Aucune photo",
  onRemove,
  className,
  maximumPhotos = 20,
}: PhotoGalleryProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
    setShowInfo(false);
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
    setShowInfo(false);
  };

  const nextPhoto = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
  };

  const prevPhoto = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedPhotoIndex === null) return;

    switch (e.key) {
      case "ArrowRight":
        nextPhoto();
        break;
      case "ArrowLeft":
        prevPhoto();
        break;
      case "Escape":
        closeLightbox();
        break;
      case "i":
        toggleInfo();
        break;
      default:
        break;
    }
  };

  return (
    <div className={cn("space-y-4", className)} onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        {photos.length > 0 && (
          <Badge variant="outline">{photos.length} / {maximumPhotos}</Badge>
        )}
      </div>

      {photos.length === 0 ? (
        <Card className="border-dashed border-gray-700 bg-gray-900/40">
          <CardContent className="flex justify-center items-center py-6 text-sm text-gray-400">
            {emptyMessage}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {photos.map((photo, index) => (
            <Card
              key={photo.id}
              className="group relative overflow-hidden border-gray-800 bg-gray-900 cursor-pointer hover:border-primary/50 transition-all"
            >
              <div
                className="aspect-square relative overflow-hidden"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={photo.preview || photo.url}
                  alt={photo.caption || `Photo ${index + 1}`}
                  className="h-full w-full object-cover transition-all hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 w-7 h-7 opacity-0 group-hover:opacity-100 z-10 bg-black/30 hover:bg-black/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove && onRemove(photo.id);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-1 right-1 w-7 h-7 opacity-0 group-hover:opacity-100 z-10 bg-black/30 hover:bg-black/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    openLightbox(index);
                  }}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              {photo.caption && (
                <div className="text-xs p-1 truncate text-gray-400">
                  {photo.caption}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Lightbox modal */}
      <Dialog open={selectedPhotoIndex !== null} onOpenChange={open => !open && closeLightbox()}>
        <DialogContent className="sm:max-w-4xl max-h-screen border-gray-800 bg-gray-950/95 p-0 overflow-hidden">
          <DialogClose className="absolute right-3 top-3 z-50" asChild>
            <Button variant="ghost" size="icon" className="bg-black/20 hover:bg-black/40">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>

          {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
            <div className="relative flex flex-col h-full">
              <div className="flex-1 relative min-h-0 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={photos[selectedPhotoIndex].url || photos[selectedPhotoIndex].preview}
                    alt={photos[selectedPhotoIndex].caption || `Photo ${selectedPhotoIndex + 1}`}
                    className="max-h-[80vh] max-w-full object-contain"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 z-10 bg-black/20 hover:bg-black/40"
                  onClick={prevPhoto}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 z-10 bg-black/20 hover:bg-black/40"
                  onClick={nextPhoto}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              <div className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">
                    {selectedPhotoIndex + 1} / {photos.length}
                  </p>
                  {photos[selectedPhotoIndex].caption && (
                    <p className="text-sm text-gray-400">
                      {photos[selectedPhotoIndex].caption}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(showInfo && "bg-gray-800")}
                    onClick={toggleInfo}
                  >
                    <Info className="h-4 w-4 mr-1" />
                    Info
                  </Button>
                </div>
              </div>

              {showInfo && (
                <div className="p-4 pt-0 text-sm bg-gray-900 border-t border-gray-800">
                  <div className="grid grid-cols-2 gap-4">
                    {photos[selectedPhotoIndex].category && (
                      <div>
                        <p className="text-gray-400">Catégorie</p>
                        <p>{photos[selectedPhotoIndex].category}</p>
                      </div>
                    )}
                    {photos[selectedPhotoIndex].createdAt && (
                      <div>
                        <p className="text-gray-400">Date</p>
                        <p>{photos[selectedPhotoIndex].createdAt.toLocaleString()}</p>
                      </div>
                    )}
                    {photos[selectedPhotoIndex].location && (
                      <div>
                        <p className="text-gray-400">Lieu</p>
                        <p>{photos[selectedPhotoIndex].location}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
