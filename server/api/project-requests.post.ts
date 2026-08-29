import { randomUUID } from 'node:crypto';
import {
  budgetValues,
  featureValues,
  preferredContactValues,
  projectTypeValues,
  timelineValues
} from '../../app/data/lead';
import { useProjectRequestsCollection } from '../models';
import { notifyProjectRequest } from '../utils/notifications';
import type {
  LocaleCode,
  PreferredContactMethod,
  ProjectRequest,
  ProjectRequestBudgetRange,
  ProjectRequestFeature,
  ProjectRequestProjectType,
  ProjectRequestTimeline
} from '~~/types';

type ValidationIssue = {
  field: string;
  code: string;
};

type ProjectRequestPayload = {
  selectedProjectTypes?: unknown;
  businessDescription?: unknown;
  requestedFeatures?: unknown;
  budgetRange?: unknown;
  timeline?: unknown;
  contact?: {
    fullName?: unknown;
    email?: unknown;
    phone?: unknown;
    company?: unknown;
    preferredContactMethod?: unknown;
  };
  preferredLocale?: unknown;
};

const maxLengths = {
  fullName: 100,
  email: 254,
  phone: 60,
  company: 120,
  businessDescription: 3000
} as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitizeString = (value: unknown, maxLength: number) => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, maxLength);
};

const normalizeSelection = <T extends string>(value: unknown, allowedValues: readonly T[], maxItems = 10) => {
  if (!Array.isArray(value)) {
    return [] as T[];
  }

  const selected = value.filter((item): item is T => {
    return typeof item === 'string' && allowedValues.includes(item as T);
  });

  return Array.from(new Set(selected)).slice(0, maxItems);
};

const normalizeOptionalChoice = <T extends string>(value: unknown, allowedValues: readonly T[]) => {
  return typeof value === 'string' && allowedValues.includes(value as T) ? value as T : undefined;
};

const hasInvalidSelection = <T extends string>(value: unknown, allowedValues: readonly T[]) => {
  if (value === undefined) {
    return false;
  }

  if (!Array.isArray(value)) {
    return true;
  }

  return value.some((item) => typeof item !== 'string' || !allowedValues.includes(item as T));
};

const normalizeLocale = (value: unknown): LocaleCode => {
  return value === 'en' ? 'en' : 'fa';
};

const createValidationError = (issues: ValidationIssue[]) => {
  return createError({
    statusCode: 400,
    statusMessage: 'Validation failed',
    data: {
      issues
    }
  });
};

export default defineEventHandler(async (event) => {
  const payload = (await readBody<ProjectRequestPayload>(event)) || {};
  const issues: ValidationIssue[] = [];

  const selectedProjectTypes = normalizeSelection<ProjectRequestProjectType>(payload.selectedProjectTypes, projectTypeValues);
  const requestedFeatures = normalizeSelection<ProjectRequestFeature>(payload.requestedFeatures, featureValues);
  const budgetRange = normalizeOptionalChoice<ProjectRequestBudgetRange>(payload.budgetRange, budgetValues);
  const timeline = normalizeOptionalChoice<ProjectRequestTimeline>(payload.timeline, timelineValues);
  const preferredContactMethod = normalizeOptionalChoice<PreferredContactMethod>(
    payload.contact?.preferredContactMethod,
    preferredContactValues
  );

  const businessDescription = sanitizeString(payload.businessDescription, maxLengths.businessDescription);
  const fullName = sanitizeString(payload.contact?.fullName, maxLengths.fullName);
  const email = sanitizeString(payload.contact?.email, maxLengths.email).toLowerCase();
  const phone = sanitizeString(payload.contact?.phone, maxLengths.phone);
  const company = sanitizeString(payload.contact?.company, maxLengths.company);
  const preferredLocale = normalizeLocale(payload.preferredLocale);

  if (hasInvalidSelection<ProjectRequestProjectType>(payload.selectedProjectTypes, projectTypeValues)) {
    issues.push({ field: 'selectedProjectTypes', code: 'invalidOption' });
  }

  if (hasInvalidSelection<ProjectRequestFeature>(payload.requestedFeatures, featureValues)) {
    issues.push({ field: 'requestedFeatures', code: 'invalidOption' });
  }

  if (!fullName) {
    issues.push({ field: 'contact.fullName', code: 'required' });
  }

  if (!email) {
    issues.push({ field: 'contact.email', code: 'required' });
  } else if (!emailPattern.test(email)) {
    issues.push({ field: 'contact.email', code: 'invalidEmail' });
  }

  if (typeof payload.budgetRange === 'string' && !budgetRange) {
    issues.push({ field: 'budgetRange', code: 'invalidOption' });
  }

  if (typeof payload.timeline === 'string' && !timeline) {
    issues.push({ field: 'timeline', code: 'invalidOption' });
  }

  if (typeof payload.contact?.preferredContactMethod === 'string' && !preferredContactMethod) {
    issues.push({ field: 'contact.preferredContactMethod', code: 'invalidOption' });
  }

  if (issues.length > 0) {
    throw createValidationError(issues);
  }

  const now = new Date();
  const reference = randomUUID();
  const userAgent = getHeader(event, 'user-agent');
  const request: ProjectRequest = {
    id: reference,
    selectedProjectTypes,
    requestedFeatures,
    contact: {
      fullName,
      email,
      ...(phone ? { phone } : {}),
      ...(company ? { company } : {}),
      ...(preferredContactMethod ? { preferredContactMethod } : {})
    },
    preferredLocale,
    source: 'website-start-a-project',
    status: 'new',
    notificationStatus: 'pending',
    createdAt: now,
    updatedAt: now,
    ...(businessDescription ? { businessDescription } : {}),
    ...(budgetRange ? { budgetRange } : {}),
    ...(timeline ? { timeline } : {}),
    ...(userAgent ? { userAgent } : {})
  };

  const config = useRuntimeConfig();
  let persistedInMongo = false;

  try {
    if (config.mongodbUri) {
      const collection = await useProjectRequestsCollection();
      await collection.insertOne(request);
      persistedInMongo = true;
    } else {
      console.info('[SAZAN project-request:fallback] MongoDB not configured. Request accepted in development mode.', {
        reference,
        selectedProjectTypes,
        requestedFeatures,
        preferredLocale,
        createdAt: request.createdAt
      });
    }
  } catch (error) {
    console.error('[SAZAN project-request] Failed to persist request', error);

    throw createError({
      statusCode: 500,
      statusMessage: 'Could not save project request'
    });
  }

  const notificationResults = await notifyProjectRequest(request, {
    reference,
    requestUrl: getRequestURL(event).toString()
  });

  const notificationStatus = notificationResults.some((result) => result.ok && !result.skipped)
    ? 'sent'
    : notificationResults.every((result) => result.skipped)
      ? 'skipped'
      : 'failed';

  if (persistedInMongo) {
    try {
      const collection = await useProjectRequestsCollection();
      await collection.updateOne(
        { id: reference },
        {
          $set: {
            notificationStatus,
            updatedAt: new Date()
          }
        }
      );
    } catch (error) {
      console.error('[SAZAN project-request] Failed to update notification status', error);
    }
  }

  return {
    ok: true,
    reference
  };
});
