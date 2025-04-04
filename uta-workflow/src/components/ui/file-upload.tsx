"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, FileIcon, CheckCircle2 } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export type FileWithPreview = File & {
  preview?: string;
};

interface FileRejection {
  file: File;
  errors: Array<{
    code: string;
    message: string;
  }>;
}

interface FileUploadProps {
  value?: FileWithPreview[];
  onChange?: (files: FileWithPreview[]) => void;
  onRemove?: (file: FileWithPreview) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: Record<string, string[]>;
  className?: string;
  disabled?: boolean;
  showPreview?: boolean;
}

export function FileUpload({
  value = [],
  onChange,
  onRemove,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = {
    "application/pdf": [".pdf"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
  },
  className,
  disabled = false,
  showPreview = true,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<FileWithPreview[]>(value);
  const [error, setError] = React.useState<string | null>(null);

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const tooLargeFiles = rejectedFiles.filter(
          (file) => file.errors[0]?.code === "file-too-large"
        );
        const tooManyFiles = rejectedFiles.filter(
          (file) => file.errors[0]?.code === "too-many-files"
        );
        const unsupportedFiles = rejectedFiles.filter(
          (file) => file.errors[0]?.code === "file-invalid-type"
        );

        if (tooLargeFiles.length > 0) {
          setError(`Un ou plusieurs fichiers dépassent la taille maximale de ${maxSize / (1024 * 1024)}Mo`);
          return;
        }

        if (tooManyFiles.length > 0) {
          setError(`Vous ne pouvez pas télécharger plus de ${maxFiles} fichiers`);
          return;
        }

        if (unsupportedFiles.length > 0) {
          setError("Type de fichier non pris en charge");
          return;
        }
      }

      // Clear errors if any
      setError(null);

      // Check if too many files
      if (files.length + acceptedFiles.length > maxFiles) {
        setError(`Vous ne pouvez pas télécharger plus de ${maxFiles} fichiers`);
        return;
      }

      // Create file previews for images
      const newFiles = acceptedFiles.map((file) => {
        const fileWithPreview = file as FileWithPreview;
        if (file.type.startsWith("image/")) {
          fileWithPreview.preview = URL.createObjectURL(file);
        }
        return fileWithPreview;
      });

      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onChange?.(updatedFiles);
    },
    [files, maxFiles, maxSize, onChange]
  );

  const removeFile = (file: FileWithPreview) => {
    const updatedFiles = files.filter((f) => f !== file);
    setFiles(updatedFiles);
    onChange?.(updatedFiles);
    onRemove?.(file);

    // Revoke the object URL to avoid memory leaks
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept,
    disabled,
  });

  // Clean up any object URLs when the component unmounts
  React.useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer",
          isDragActive
            ? "border-primary/50 bg-primary/5"
            : "border-gray-700 hover:border-gray-600",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-sm text-gray-400 text-center">
          {isDragActive
            ? "Déposez les fichiers ici"
            : "Glissez-déposez des fichiers ici, ou cliquez pour sélectionner des fichiers"}
        </p>
        <p className="text-xs text-gray-500 mt-1 text-center">
          {`PDF, JPG, JPEG ou PNG • Max ${maxFiles} fichiers • Max ${
            maxSize / (1024 * 1024)
          }Mo par fichier`}
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, i) => (
            <li
              key={i}
              className="flex items-center justify-between p-2 bg-gray-800 rounded-md border border-gray-700"
            >
              <div className="flex items-center space-x-2">
                {file.type.startsWith("image/") && file.preview && showPreview ? (
                  <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <FileIcon className="h-6 w-6 text-gray-400" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file);
                }}
                className="h-7 w-7 rounded-full p-0 text-gray-400 hover:text-gray-100"
                disabled={disabled}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Supprimer</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
