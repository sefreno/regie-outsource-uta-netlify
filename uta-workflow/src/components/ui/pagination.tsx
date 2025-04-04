"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Calculer les pages à afficher
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Afficher toutes les pages si le total est <= 7
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Toujours afficher la première page
      pages.push(1);

      // Calculer les pages visibles autour de la page actuelle
      if (currentPage <= 3) {
        // Près du début
        pages.push(2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Près de la fin
        pages.push("...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Au milieu
        pages.push(
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        className="w-8 h-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Page précédente</span>
      </Button>

      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {typeof page === "number" ? (
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(page)}
              className={cn(
                "w-8 h-8 p-0",
                currentPage === page && "bg-primary text-primary-foreground"
              )}
            >
              {page}
            </Button>
          ) : (
            <span className="w-8 h-8 flex items-center justify-center">...</span>
          )}
        </React.Fragment>
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className="w-8 h-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Page suivante</span>
      </Button>
    </div>
  );
}
