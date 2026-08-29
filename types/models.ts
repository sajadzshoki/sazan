export type LocaleCode = 'fa' | 'en';

export type LocalizedString = Record<LocaleCode, string>;

export type PublishStatus = 'draft' | 'review' | 'published' | 'archived';

export type MediaProvider = 'local' | 'minio';

export interface TimestampedEntity {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MediaAsset {
  provider: MediaProvider;
  key: string;
  url?: string;
  alt?: LocalizedString;
  mimeType?: string;
  width?: number;
  height?: number;
  size?: number;
}

export interface Category extends TimestampedEntity {
  title: LocalizedString;
  slug: string;
  description?: LocalizedString;
  order?: number;
  status: PublishStatus;
}

export interface Service extends TimestampedEntity {
  title: LocalizedString;
  slug: string;
  shortDescription: LocalizedString;
  description?: LocalizedString;
  icon?: string;
  order?: number;
  featured?: boolean;
  status: PublishStatus;
}

export interface ProjectPricing {
  visibility: 'public' | 'private' | 'on-request';
  currency?: string;
  min?: number;
  max?: number;
  note?: LocalizedString;
}

export interface ProjectTimeline {
  startDate?: Date;
  endDate?: Date;
  durationWeeks?: number;
  note?: LocalizedString;
}

export interface ProjectTranslationMeta {
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Project extends TimestampedEntity {
  title: LocalizedString;
  slug: string;
  shortDescription: LocalizedString;
  fullDescription?: LocalizedString;
  categoryId?: string;
  category?: Category;
  technologies: string[];
  coverImage?: MediaAsset;
  gallery?: MediaAsset[];
  videos?: MediaAsset[];
  demoUrl?: string;
  projectUrl?: string;
  pricing?: ProjectPricing;
  timeline?: ProjectTimeline;
  featured: boolean;
  status: PublishStatus;
  translations?: Partial<Record<LocaleCode, ProjectTranslationMeta>>;
}

export type ProjectRequestBudgetRange = 'under-5k' | '5k-15k' | '15k-50k' | '50k-plus' | 'not-sure';
export type ProjectRequestStatus = 'new' | 'qualified' | 'contacted' | 'proposal' | 'won' | 'lost' | 'archived';

export interface ProjectRequest extends TimestampedEntity {
  fullName: string;
  email: string;
  company?: string;
  phone?: string;
  preferredLocale: LocaleCode;
  services: string[];
  budgetRange?: ProjectRequestBudgetRange;
  timeline?: string;
  message: string;
  source?: string;
  status: ProjectRequestStatus;
}

export type ContactMessageStatus = 'new' | 'read' | 'replied' | 'archived';

export interface ContactMessage extends TimestampedEntity {
  fullName: string;
  email: string;
  subject?: string;
  message: string;
  preferredLocale: LocaleCode;
  status: ContactMessageStatus;
}
