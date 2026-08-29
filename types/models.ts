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
  active?: boolean;
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
  services?: string[];
  technologies: string[];
  coverImage?: MediaAsset;
  gallery?: MediaAsset[];
  videos?: MediaAsset[];
  videoUrl?: string;
  demoUrl?: string;
  projectUrl?: string;
  pricing?: ProjectPricing;
  timeline?: ProjectTimeline;
  year?: string;
  featured: boolean;
  status: PublishStatus;
  translations?: Partial<Record<LocaleCode, ProjectTranslationMeta>>;
}

export type ProjectRequestProjectType =
  | 'website'
  | 'webApplication'
  | 'mobileApplication'
  | 'ecommerce'
  | 'adminPanel'
  | 'backendApi'
  | 'somethingElse'
  | 'notSure';

export type ProjectRequestFeature =
  | 'uiUxDesign'
  | 'authentication'
  | 'payments'
  | 'dashboard'
  | 'adminPanel'
  | 'apiIntegration'
  | 'ecommerce'
  | 'aiFeatures'
  | 'other'
  | 'notSure';

export type ProjectRequestBudgetRange = 'under-2k' | '2k-5k' | '5k-10k' | '10k-25k' | '25k-plus' | 'not-sure';
export type ProjectRequestTimeline = 'asap' | 'within-1-month' | '1-3-months' | 'flexible' | 'not-sure';
export type PreferredContactMethod = 'email' | 'whatsapp' | 'telegram' | 'phone';
export type ProjectRequestStatus = 'new' | 'reviewing' | 'contacted' | 'inProgress' | 'completed' | 'archived';

export interface ProjectRequestContact {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  preferredContactMethod?: PreferredContactMethod;
}

export interface ProjectRequest extends TimestampedEntity {
  selectedProjectTypes: ProjectRequestProjectType[];
  businessDescription?: string;
  requestedFeatures: ProjectRequestFeature[];
  budgetRange?: ProjectRequestBudgetRange;
  timeline?: ProjectRequestTimeline;
  contact: ProjectRequestContact;
  preferredLocale: LocaleCode;
  source?: string;
  status: ProjectRequestStatus;
  notificationStatus?: 'pending' | 'sent' | 'skipped' | 'failed';
  userAgent?: string;
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

export interface PublicContactSettings {
  email: string;
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  social: {
    linkedin?: string;
    behance?: string;
    dribbble?: string;
  };
}

export interface SiteSettings extends TimestampedEntity {
  key: 'publicContact';
  contact: PublicContactSettings;
}
