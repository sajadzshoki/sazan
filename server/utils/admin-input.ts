import { createError } from 'h3';
import type {
  Category,
  LocalizedString,
  Project,
  ProjectPricing,
  ProjectRequestStatus,
  ProjectTimeline,
  PublicContactSettings,
  PublishStatus,
  Service
} from '~~/types';

export const publishStatuses = ['draft', 'review', 'published', 'archived'] as const satisfies readonly PublishStatus[];
export const requestStatuses = ['new', 'reviewing', 'contacted', 'inProgress', 'completed', 'archived'] as const satisfies readonly ProjectRequestStatus[];
export const pricingVisibilities = ['public', 'private', 'on-request'] as const satisfies readonly ProjectPricing['visibility'][];

const MAX_TEXT_LENGTH = 4000;
const MAX_URL_LENGTH = 600;

export const safeError = (statusCode: number, statusMessage: string) => createError({ statusCode, statusMessage });

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
};

const sanitizeText = (value: unknown, maxLength = MAX_TEXT_LENGTH) => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength);
};

const sanitizeMultiline = (value: unknown, maxLength = MAX_TEXT_LENGTH) => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
};

export const sanitizeSlug = (value: unknown) => {
  const source = sanitizeText(value, 140).toLowerCase();
  const slug = source
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');

  return slug.slice(0, 120);
};

const sanitizeUrl = (value: unknown) => {
  const url = sanitizeText(value, MAX_URL_LENGTH);

  if (!url) {
    return '';
  }

  try {
    const parsed = new URL(url);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol) ? url : '';
  } catch {
    return url.startsWith('/') ? url : '';
  }
};

const optionalUrl = (value: unknown) => sanitizeUrl(value) || undefined;

const localized = (value: unknown, fieldName: string, required = true): LocalizedString => {
  if (!isRecord(value)) {
    throw safeError(400, `${fieldName} must include English and Persian values`);
  }

  const en = sanitizeMultiline(value.en);
  const fa = sanitizeMultiline(value.fa);

  if (required && (!en || !fa)) {
    throw safeError(400, `${fieldName} is required in English and Persian`);
  }

  return { en, fa };
};

const optionalLocalized = (value: unknown, fieldName: string): LocalizedString | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  const result = localized(value, fieldName, false);
  return result.en || result.fa ? result : undefined;
};

const stringArray = (value: unknown, maxItems = 24) => {
  const rawItems = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(/[\n,]/)
      : [];

  return rawItems
    .map((item) => sanitizeText(item, 80))
    .filter(Boolean)
    .slice(0, maxItems);
};

const numberValue = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const optionalNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const publishStatus = (value: unknown, fallback: PublishStatus = 'draft'): PublishStatus => {
  return typeof value === 'string' && publishStatuses.includes(value as PublishStatus) ? value as PublishStatus : fallback;
};

const pricing = (value: unknown): ProjectPricing | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  const visibility = typeof value.visibility === 'string' && pricingVisibilities.includes(value.visibility as ProjectPricing['visibility'])
    ? value.visibility as ProjectPricing['visibility']
    : 'on-request';
  const note = optionalLocalized(value.note, 'pricing note');
  const next: ProjectPricing = { visibility };
  const currency = sanitizeText(value.currency, 12).toUpperCase();
  const min = optionalNumber(value.min);
  const max = optionalNumber(value.max);

  if (currency) {
    next.currency = currency;
  }

  if (min !== undefined && min >= 0) {
    next.min = min;
  }

  if (max !== undefined && max >= 0) {
    next.max = max;
  }

  if (note) {
    next.note = note;
  }

  return next;
};

const timeline = (value: unknown): ProjectTimeline | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  const durationWeeks = optionalNumber(value.durationWeeks);
  const note = optionalLocalized(value.note, 'timeline note');
  const next: ProjectTimeline = {};

  if (durationWeeks !== undefined && durationWeeks >= 0) {
    next.durationWeeks = durationWeeks;
  }

  if (note) {
    next.note = note;
  }

  return Object.keys(next).length ? next : undefined;
};

export const parseProjectInput = (body: unknown): Project => {
  if (!isRecord(body)) {
    throw safeError(400, 'Invalid project payload');
  }

  const slug = sanitizeSlug(body.slug);

  if (!slug) {
    throw safeError(400, 'Project slug is required');
  }

  const title = localized(body.title, 'Project title');
  const shortDescription = localized(body.shortDescription, 'Project short description');
  const fullDescription = optionalLocalized(body.fullDescription, 'Project full description');
  const categoryId = sanitizeText(body.categoryId, 140) || undefined;
  const services = stringArray(body.services);
  const technologies = stringArray(body.technologies);
  const galleryRefs = stringArray(body.galleryRefs, 12);
  const coverImageUrl = optionalUrl(body.coverImageUrl);
  const coverImageKey = sanitizeText(body.coverImageKey, 260);
  const coverAlt = optionalLocalized(body.coverAlt, 'Cover alt text') || title;
  const videoUrl = optionalUrl(body.videoUrl) || sanitizeText(body.videoUrl, 600) || undefined;
  const demoUrl = optionalUrl(body.demoUrl);
  const projectUrl = optionalUrl(body.projectUrl);
  const projectPricing = pricing(body.pricing);
  const projectTimeline = timeline(body.timeline);

  if (!technologies.length) {
    technologies.push('Nuxt');
  }

  const nextProject: Project = {
    title,
    slug,
    shortDescription,
    services,
    technologies,
    year: sanitizeText(body.year, 12) || String(new Date().getFullYear()),
    featured: Boolean(body.featured),
    status: publishStatus(body.status, 'draft')
  };

  const id = typeof body.id === 'string' && body.id ? sanitizeText(body.id, 140) : '';

  if (id) {
    nextProject.id = id;
  }

  if (fullDescription) {
    nextProject.fullDescription = fullDescription;
  }

  if (categoryId) {
    nextProject.categoryId = categoryId;
  }

  if (coverImageUrl || coverImageKey) {
    nextProject.coverImage = {
      provider: 'local',
      key: coverImageKey || coverImageUrl || `manual:${slug}:cover`,
      alt: coverAlt
    };

    if (coverImageUrl) {
      nextProject.coverImage.url = coverImageUrl;
    }
  }

  if (galleryRefs.length) {
    nextProject.gallery = galleryRefs.map((ref, index) => {
      const refUrl = optionalUrl(ref);

      return {
        provider: 'local' as const,
        key: ref,
        ...(refUrl ? { url: refUrl } : {}),
        alt: { en: `${title.en} gallery ${index + 1}`, fa: `تصویر ${index + 1} ${title.fa}` }
      };
    });
  }

  if (videoUrl) {
    nextProject.videoUrl = videoUrl;
  }

  if (demoUrl) {
    nextProject.demoUrl = demoUrl;
  }

  if (projectUrl) {
    nextProject.projectUrl = projectUrl;
  }

  if (projectPricing) {
    nextProject.pricing = projectPricing;
  }

  if (projectTimeline) {
    nextProject.timeline = projectTimeline;
  }

  return nextProject;
};

export const parseCategoryInput = (body: unknown): Category => {
  if (!isRecord(body)) {
    throw safeError(400, 'Invalid category payload');
  }

  const slug = sanitizeSlug(body.slug);

  if (!slug) {
    throw safeError(400, 'Category slug is required');
  }

  const nextCategory: Category = {
    title: localized(body.title, 'Category title'),
    slug,
    order: numberValue(body.order, 0),
    status: Boolean(body.active ?? body.enabled ?? body.status === 'published') ? 'published' : publishStatus(body.status, 'draft')
  };
  const id = typeof body.id === 'string' && body.id ? sanitizeText(body.id, 140) : '';
  const description = optionalLocalized(body.description, 'Category description');

  if (id) {
    nextCategory.id = id;
  }

  if (description) {
    nextCategory.description = description;
  }

  return nextCategory;
};

export const parseServiceInput = (body: unknown): Service => {
  if (!isRecord(body)) {
    throw safeError(400, 'Invalid service payload');
  }

  const slug = sanitizeSlug(body.slug);

  if (!slug) {
    throw safeError(400, 'Service slug is required');
  }

  const active = Boolean(body.active ?? body.status === 'published');

  const nextService: Service = {
    title: localized(body.title, 'Service title'),
    slug,
    shortDescription: localized(body.shortDescription, 'Service short description'),
    icon: sanitizeText(body.icon, 80),
    order: numberValue(body.order, 0),
    featured: Boolean(body.featured),
    active,
    status: active ? 'published' : publishStatus(body.status, 'draft')
  };
  const id = typeof body.id === 'string' && body.id ? sanitizeText(body.id, 140) : '';
  const description = optionalLocalized(body.description, 'Service description');

  if (id) {
    nextService.id = id;
  }

  if (description) {
    nextService.description = description;
  }

  return nextService;
};

export const parseRequestStatusInput = (body: unknown): ProjectRequestStatus => {
  if (!isRecord(body) || typeof body.status !== 'string' || !requestStatuses.includes(body.status as ProjectRequestStatus)) {
    throw safeError(400, 'Invalid project request status');
  }

  return body.status as ProjectRequestStatus;
};

export const parseSettingsInput = (body: unknown): PublicContactSettings => {
  if (!isRecord(body)) {
    throw safeError(400, 'Invalid settings payload');
  }

  const social = isRecord(body.social) ? body.social : {};
  const email = sanitizeText(body.email, 254).toLowerCase();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw safeError(400, 'A valid public email is required');
  }

  const phone = sanitizeText(body.phone, 80);
  const whatsapp = sanitizeText(body.whatsapp, 80);
  const telegram = sanitizeText(body.telegram, 80);
  const linkedin = optionalUrl(social.linkedin);
  const behance = optionalUrl(social.behance);
  const dribbble = optionalUrl(social.dribbble);

  return {
    email,
    ...(phone ? { phone } : {}),
    ...(whatsapp ? { whatsapp } : {}),
    ...(telegram ? { telegram } : {}),
    social: {
      ...(linkedin ? { linkedin } : {}),
      ...(behance ? { behance } : {}),
      ...(dribbble ? { dribbble } : {})
    }
  };
};
