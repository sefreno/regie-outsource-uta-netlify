// Types for workflow
export type DossierStatus =
  | 'qualification'
  | 'confirmation'
  | 'administrative'
  | 'technical_visit'
  | 'installation'
  | 'billing';

export type UserRole =
  | 'qualification'
  | 'confirmation'
  | 'administrative'
  | 'technical_visit'
  | 'installation'
  | 'billing'
  | 'admin';

export interface HomeDetails {
  type: 'house' | 'apartment' | 'other';
  size: number; // in m²
  constructionYear?: number;
  heatingType: 'electric' | 'gas' | 'oil' | 'wood' | 'other';
  currentConsumption?: number; // in kWh/year
  isOwner: boolean;
}

export interface ClientEligibility {
  fiscalReference: string;
  isVerified: boolean;
  incomeCategory: 'very_modest' | 'modest' | 'intermediate' | 'high';
  subsidyRate: number; // percentage of eligibility
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: Date;
  url: string;
}

export interface Dossier {
  id: string;
  status: DossierStatus;
  createdAt: Date;
  updatedAt: Date;
  // Client details
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;
  // Home details
  homeDetails: HomeDetails;
  // Eligibility
  eligibility?: ClientEligibility;
  // Documents
  documents: Document[];
  // Dates
  submissionDate?: Date;
  confirmationDate?: Date;
  technicalVisitDate?: Date;
  installationDate?: Date;
  completionDate?: Date;
  billingDate?: Date;
  // Financial
  estimatedCost?: number;
  finalCost?: number;
  subsidyAmount?: number;
  remainingAmount?: number;
  // Notes
  notes: string[];
  // Current assignee
  assignedTo?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  team?: string;
}

export interface WorkflowStats {
  qualification: number;
  confirmation: number;
  administrative: number;
  technicalVisit: number;
  installation: number;
  billing: number;
  completed: number;
}

// API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
