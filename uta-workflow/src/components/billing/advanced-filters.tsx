"use client";

import React, { useState } from "react";
import { X, Filter, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ServiceType } from "@/lib/billing/models";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface FilterOptions {
  serviceTypes: ServiceType[];
  onlyActive: boolean;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  minAmount: number | null;
  maxAmount: number | null;
  activityCountMin: number | null;
}

interface AdvancedFiltersProps {
  currentFilters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

export function AdvancedFilters({
  currentFilters,
  onApplyFilters,
  onClearFilters,
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);
  const [open, setOpen] = useState(false);

  // Compter le nombre de filtres actifs
  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (filters.serviceTypes.length > 0) count += 1;
    if (filters.onlyActive) count += 1;
    if (filters.dateRange.start || filters.dateRange.end) count += 1;
    if (filters.minAmount || filters.maxAmount) count += 1;
    if (filters.activityCountMin) count += 1;
    return count;
  };

  // Gérer les changements de services
  const handleServiceToggle = (service: ServiceType) => {
    const isSelected = filters.serviceTypes.includes(service);

    if (isSelected) {
      setFilters({
        ...filters,
        serviceTypes: filters.serviceTypes.filter(s => s !== service)
      });
    } else {
      setFilters({
        ...filters,
        serviceTypes: [...filters.serviceTypes, service]
      });
    }
  };

  // Gérer les changements de montants
  const handleAmountChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : Number.parseFloat(value);

    if (type === 'min') {
      setFilters({
        ...filters,
        minAmount: numValue
      });
    } else {
      setFilters({
        ...filters,
        maxAmount: numValue
      });
    }
  };

  // Appliquer les filtres
  const applyFilters = () => {
    onApplyFilters(filters);
    setOpen(false);
  };

  // Réinitialiser les filtres
  const clearFilters = () => {
    const emptyFilters: FilterOptions = {
      serviceTypes: [],
      onlyActive: false,
      dateRange: { start: null, end: null },
      minAmount: null,
      maxAmount: null,
      activityCountMin: null
    };

    setFilters(emptyFilters);
    onClearFilters();
    setOpen(false);
  };

  // Obtenir une couleur selon le type de service (repris du composant CollaboratorPerformanceCard)
  const getServiceColor = (service: ServiceType): string => {
    const colors: Record<ServiceType, string> = {
      [ServiceType.TECHNICAL_VISIT]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      [ServiceType.INSTALLATION]: 'bg-green-500/10 text-green-500 border-green-500/20',
      [ServiceType.QUALIFICATION]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      [ServiceType.CONFIRMATION]: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      [ServiceType.ADMINISTRATIVE]: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      [ServiceType.BILLING]: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return colors[service] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filtres</span>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between border-b border-gray-800 px-3 py-2">
            <h3 className="font-medium">Filtres avancés</h3>
            <Button variant="ghost" size="sm" className="h-8 px-2" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4 p-4">
            {/* Types de services */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium">Types de services</h4>
              <div className="flex flex-wrap gap-2">
                {Object.values(ServiceType).map((service) => (
                  <Badge
                    key={service}
                    variant="outline"
                    className={`cursor-pointer
                      ${filters.serviceTypes.includes(service)
                        ? getServiceColor(service)
                        : 'bg-gray-800/50 text-gray-400'}`}
                    onClick={() => handleServiceToggle(service)}
                  >
                    {service}
                    {filters.serviceTypes.includes(service) && (
                      <Check className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-800" />

            {/* Statut actif */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="active-only"
                checked={filters.onlyActive}
                onCheckedChange={(checked) =>
                  setFilters({...filters, onlyActive: checked as boolean})
                }
              />
              <Label htmlFor="active-only">
                Collaborateurs actifs uniquement
              </Label>
            </div>

            <Separator className="bg-gray-800" />

            {/* Plage de montants */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium">Montant facturé (€)</h4>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minAmount ?? ''}
                  onChange={(e) => handleAmountChange('min', e.target.value)}
                  className="h-8"
                />
                <span className="text-gray-400">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxAmount ?? ''}
                  onChange={(e) => handleAmountChange('max', e.target.value)}
                  className="h-8"
                />
              </div>
            </div>

            <Separator className="bg-gray-800" />

            {/* Nombre minimum d'activités */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium">Nombre minimum d'activités</h4>
              <Input
                type="number"
                placeholder="Min"
                value={filters.activityCountMin ?? ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    activityCountMin: e.target.value === '' ? null : Number.parseInt(e.target.value)
                  })
                }
                className="h-8"
              />
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-gray-800 bg-gray-950 px-4 py-2">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Réinitialiser
            </Button>
            <Button size="sm" onClick={applyFilters}>
              Appliquer
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
