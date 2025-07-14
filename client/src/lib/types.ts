export interface ContentItem {
  id: number;
  title: string;
  description?: string;
  category: string;
  type: string;
  fileUrl: string;
  downloadCount?: number;
  featured?: boolean;
  createdAt?: Date;
}

export interface ProjectRequest {
  id: number;
  fullName: string;
  email: string;
  projectType: string;
  timeline: string;
  description: string;
  budgetRange: string;
  contactMethod: string;
  referenceFiles?: string[];
  status?: string;
  createdAt?: Date;
}

export type CategoryType = 'all' | 'general' | 'social-media' | 'field-tools' | 'events' | 'store';

export interface DownloadResponse {
  message: string;
  fileUrl: string;
  fileName: string;
}
