export type RequestCategory =
  | 'Street Lighting'
  | 'Water & Sanitation'
  | 'Roads & Infrastructure'
  | 'Garbage & Environment'
  | 'Public Health'
  | 'Agriculture & Livestock'
  | 'Education & Bursary'
  | 'Other County Services';

export type RequestStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';

export type RequestPriority = 'Standard' | 'High' | 'Urgent';

export interface TimelineEvent {
  id: string;
  status: RequestStatus;
  title: string;
  description: string;
  actor: string;
  role: 'Citizen' | 'System' | 'Service Desk Admin' | 'County Officer';
  timestamp: string;
}

export interface ServiceRequest {
  id: string;
  trackingNumber: string; // e.g. MCG-2026-4821
  title: string;
  category: RequestCategory;
  subCounty: string;
  ward: string;
  landmark: string;
  description: string;
  priority: RequestPriority;
  status: RequestStatus;
  imageUrl?: string;
  citizenId?: string;
  citizenName?: string;
  citizenPhone?: string;
  citizenEmail?: string;
  nationalId?: string;
  assignedDepartment?: string;
  assignedOfficer?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  feedbackRating?: number; // 1 to 5
  feedbackComment?: string;
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface CitizenUser {
  id: string;
  nationalId: string;
  fullName: string;
  email: string;
  phone: string;
  subCounty: string;
  ward: string;
  role: 'citizen';
  createdAt: string;
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  department: string;
  role: 'admin';
  badgeNumber: string;
}

export interface AnalyticsSummary {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  resolvedRate: number;
  averageResolutionDays: number;
  categoryBreakdown: { category: string; count: number }[];
  subCountyBreakdown: { subCounty: string; total: number; resolved: number }[];
  priorityBreakdown: { priority: string; count: number }[];
}

export interface SubCountyData {
  name: string;
  wards: string[];
}
