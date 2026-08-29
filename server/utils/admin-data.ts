import { randomUUID } from 'node:crypto';
import type { Filter, OptionalUnlessRequiredId } from 'mongodb';
import { portfolioCategories, portfolioProjects, type PortfolioProject } from '../../app/data/projects';
import { services as homeServices } from '../../app/data/home';
import {
  useCategoriesCollection,
  useProjectRequestsCollection,
  useProjectsCollection,
  useServicesCollection,
  useSiteSettingsCollection
} from '../models';
import type { Category, LocaleCode, Project, ProjectRequest, PublicContactSettings, Service, SiteSettings } from '~~/types';

const localizedCategoryTitles: Record<string, { en: string; fa: string }> = {
  websites: { en: 'Websites', fa: 'وب‌سایت‌ها' },
  webApps: { en: 'Web Apps', fa: 'وب‌اپ‌ها' },
  mobileApps: { en: 'Mobile Apps', fa: 'موبایل' },
  ecommerce: { en: 'E-commerce', fa: 'فروشگاه آنلاین' },
  adminPanels: { en: 'Admin Panels', fa: 'پنل مدیریتی' },
  backendSystems: { en: 'Backend Systems', fa: 'سیستم بک‌اند' }
};

const localizedServiceDescriptions: Record<string, { en: string; fa: string }> = {
  websites: {
    en: 'High-performing brand, marketing, and content websites.',
    fa: 'وب‌سایت‌های برند، مارکتینگ و محتوا با عملکرد بالا.'
  },
  webApps: {
    en: 'Product interfaces, portals, dashboards, and real-time workflows.',
    fa: 'رابط‌های محصول، پورتال‌ها، داشبوردها و جریان‌های بلادرنگ.'
  },
  mobileApps: {
    en: 'Focused iOS, Android, and cross-platform mobile experiences.',
    fa: 'تجربه‌های متمرکز موبایل برای iOS، Android و چندسکویی.'
  },
  ecommerce: {
    en: 'Storefronts, catalogs, checkout, and commerce systems.',
    fa: 'فروشگاه، کاتالوگ، پرداخت و سیستم‌های تجارت.'
  },
  adminPanels: {
    en: 'Internal tools for permissions, workflows, reporting, and operations.',
    fa: 'ابزارهای داخلی برای دسترسی، فرآیند، گزارش و عملیات.'
  },
  backendSystems: {
    en: 'APIs, data models, integrations, and service foundations.',
    fa: 'API، مدل داده، یکپارچه‌سازی و زیرساخت سرویس.'
  }
};

type AdminMemoryStore = {
  projects: Project[];
  categories: Category[];
  services: Service[];
  projectRequests: ProjectRequest[];
  siteSettings: SiteSettings;
};

type AdminGlobal = typeof globalThis & {
  __sazanAdminMemoryStore?: AdminMemoryStore;
};

const adminGlobal = globalThis as AdminGlobal;

const getNow = () => new Date();

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const isMongoConfigured = () => Boolean(useRuntimeConfig().mongodbUri);

const createDefaultSiteSettings = (): SiteSettings => {
  const config = useRuntimeConfig();
  const contactConfig = config.public.contact;
  const now = getNow();

  return {
    id: 'settings_public_contact',
    key: 'publicContact',
    contact: {
      email: contactConfig?.email || 'hello@sazan.studio',
      ...(contactConfig?.phone ? { phone: contactConfig.phone } : {}),
      ...(contactConfig?.whatsapp ? { whatsapp: contactConfig.whatsapp } : {}),
      ...(contactConfig?.telegram ? { telegram: contactConfig.telegram } : {}),
      social: {
        ...(contactConfig?.social?.linkedin ? { linkedin: contactConfig.social.linkedin } : {}),
        ...(contactConfig?.social?.behance ? { behance: contactConfig.social.behance } : {}),
        ...(contactConfig?.social?.dribbble ? { dribbble: contactConfig.social.dribbble } : {})
      }
    },
    createdAt: now,
    updatedAt: now
  };
};

const portfolioProjectToProject = (project: PortfolioProject, index: number): Project => {
  const now = getNow();

  return {
    id: project.id,
    title: { ...project.title },
    slug: project.slug,
    shortDescription: { ...project.shortDescription },
    fullDescription: { ...project.fullDescription },
    categoryId: project.category,
    services: [...project.services],
    technologies: [...project.technologies],
    coverImage: {
      provider: 'local',
      key: `abstract:${project.slug}:cover`,
      alt: { ...project.title }
    },
    gallery: project.gallery.map((item) => ({
      provider: 'local',
      key: `abstract:${project.slug}:${item.id}`,
      alt: { ...item.title }
    })),
    ...(project.video ? { videoUrl: `abstract:${project.slug}:video` } : {}),
    ...(project.demoUrl ? { demoUrl: project.demoUrl } : {}),
    ...(project.projectUrl ? { projectUrl: project.projectUrl } : {}),
    ...(project.pricing ? { pricing: clone(project.pricing) } : {}),
    ...(project.timeline ? { timeline: clone(project.timeline) } : {}),
    year: project.year,
    featured: project.featured,
    status: project.status,
    createdAt: new Date(now.getTime() - index * 60 * 60 * 1000),
    updatedAt: now
  };
};

const createSeedCategories = (): Category[] => {
  const now = getNow();

  return portfolioCategories.map((category, index) => ({
    id: category,
    title: localizedCategoryTitles[category] || { en: category, fa: category },
    slug: category,
    description: localizedServiceDescriptions[category] || { en: category, fa: category },
    order: index + 1,
    status: 'published',
    createdAt: now,
    updatedAt: now
  }));
};

const createSeedServices = (): Service[] => {
  const now = getNow();

  return homeServices.map((service, index) => ({
    id: service.key,
    title: localizedCategoryTitles[service.key] || { en: service.key, fa: service.key },
    slug: service.key,
    shortDescription: localizedServiceDescriptions[service.key] || { en: service.key, fa: service.key },
    description: localizedServiceDescriptions[service.key] || { en: service.key, fa: service.key },
    icon: service.technologies[0] || '',
    order: index + 1,
    featured: index < 3,
    active: true,
    status: 'published',
    createdAt: now,
    updatedAt: now
  }));
};

const getMemoryStore = () => {
  if (!adminGlobal.__sazanAdminMemoryStore) {
    adminGlobal.__sazanAdminMemoryStore = {
      projects: portfolioProjects.map((project, index) => portfolioProjectToProject(project, index)),
      categories: createSeedCategories(),
      services: createSeedServices(),
      projectRequests: [],
      siteSettings: createDefaultSiteSettings()
    };
  }

  return adminGlobal.__sazanAdminMemoryStore;
};

const sortByUpdatedAt = <T extends { updatedAt?: Date | string; createdAt?: Date | string }>(items: T[]) => {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left.updatedAt || left.createdAt || 0).getTime();
    const rightTime = new Date(right.updatedAt || right.createdAt || 0).getTime();

    return rightTime - leftTime;
  });
};

const byId = <T extends { id?: string }>(id: string) => ({ id } as Filter<T>);

export const adminDataStatus = () => ({
  provider: isMongoConfigured() ? 'mongodb' : 'memory-fallback'
});

export const listAdminProjects = async () => {
  if (isMongoConfigured()) {
    const collection = await useProjectsCollection();
    return collection.find({}).sort({ updatedAt: -1 }).toArray();
  }

  return clone(sortByUpdatedAt(getMemoryStore().projects));
};

export const createAdminProject = async (project: Project) => {
  const now = getNow();
  const nextProject: Project = {
    ...project,
    id: project.id || randomUUID(),
    createdAt: now,
    updatedAt: now
  };

  if (isMongoConfigured()) {
    const collection = await useProjectsCollection();
    await collection.insertOne(nextProject as OptionalUnlessRequiredId<Project>);
    return nextProject;
  }

  getMemoryStore().projects.unshift(nextProject);
  return clone(nextProject);
};

export const updateAdminProject = async (id: string, patch: Partial<Project>) => {
  const updatedAt = getNow();

  if (isMongoConfigured()) {
    const collection = await useProjectsCollection();
    await collection.updateOne(byId<Project>(id), { $set: { ...patch, updatedAt } });
    return collection.findOne(byId<Project>(id));
  }

  const store = getMemoryStore();
  const index = store.projects.findIndex((project) => project.id === id);

  if (index < 0) {
    return null;
  }

  const currentProject = store.projects[index];

  if (!currentProject) {
    return null;
  }

  const nextProject: Project = {
    ...currentProject,
    ...patch,
    id,
    updatedAt
  };

  store.projects[index] = nextProject;

  return clone(nextProject);
};

export const deleteAdminProject = async (id: string) => {
  if (isMongoConfigured()) {
    const collection = await useProjectsCollection();
    const result = await collection.deleteOne(byId<Project>(id));
    return result.deletedCount > 0;
  }

  const store = getMemoryStore();
  const initialLength = store.projects.length;
  store.projects = store.projects.filter((project) => project.id !== id);

  return store.projects.length !== initialLength;
};

export const listAdminCategories = async () => {
  if (isMongoConfigured()) {
    const collection = await useCategoriesCollection();
    return collection.find({}).sort({ order: 1, updatedAt: -1 }).toArray();
  }

  return clone([...getMemoryStore().categories].sort((left, right) => (left.order || 0) - (right.order || 0)));
};

export const createAdminCategory = async (category: Category) => {
  const now = getNow();
  const nextCategory: Category = {
    ...category,
    id: category.id || randomUUID(),
    createdAt: now,
    updatedAt: now
  };

  if (isMongoConfigured()) {
    const collection = await useCategoriesCollection();
    await collection.insertOne(nextCategory as OptionalUnlessRequiredId<Category>);
    return nextCategory;
  }

  getMemoryStore().categories.push(nextCategory);
  return clone(nextCategory);
};

export const updateAdminCategory = async (id: string, patch: Partial<Category>) => {
  const updatedAt = getNow();

  if (isMongoConfigured()) {
    const collection = await useCategoriesCollection();
    await collection.updateOne(byId<Category>(id), { $set: { ...patch, updatedAt } });
    return collection.findOne(byId<Category>(id));
  }

  const store = getMemoryStore();
  const index = store.categories.findIndex((category) => category.id === id);

  if (index < 0) {
    return null;
  }

  const currentCategory = store.categories[index];

  if (!currentCategory) {
    return null;
  }

  const nextCategory: Category = {
    ...currentCategory,
    ...patch,
    id,
    updatedAt
  };

  store.categories[index] = nextCategory;

  return clone(nextCategory);
};

export const deleteAdminCategory = async (id: string) => {
  if (isMongoConfigured()) {
    const collection = await useCategoriesCollection();
    const result = await collection.deleteOne(byId<Category>(id));
    return result.deletedCount > 0;
  }

  const store = getMemoryStore();
  const initialLength = store.categories.length;
  store.categories = store.categories.filter((category) => category.id !== id);

  return store.categories.length !== initialLength;
};

export const listAdminServices = async () => {
  if (isMongoConfigured()) {
    const collection = await useServicesCollection();
    return collection.find({}).sort({ order: 1, updatedAt: -1 }).toArray();
  }

  return clone([...getMemoryStore().services].sort((left, right) => (left.order || 0) - (right.order || 0)));
};

export const createAdminService = async (service: Service) => {
  const now = getNow();
  const nextService: Service = {
    ...service,
    id: service.id || randomUUID(),
    createdAt: now,
    updatedAt: now
  };

  if (isMongoConfigured()) {
    const collection = await useServicesCollection();
    await collection.insertOne(nextService as OptionalUnlessRequiredId<Service>);
    return nextService;
  }

  getMemoryStore().services.push(nextService);
  return clone(nextService);
};

export const updateAdminService = async (id: string, patch: Partial<Service>) => {
  const updatedAt = getNow();

  if (isMongoConfigured()) {
    const collection = await useServicesCollection();
    await collection.updateOne(byId<Service>(id), { $set: { ...patch, updatedAt } });
    return collection.findOne(byId<Service>(id));
  }

  const store = getMemoryStore();
  const index = store.services.findIndex((service) => service.id === id);

  if (index < 0) {
    return null;
  }

  const currentService = store.services[index];

  if (!currentService) {
    return null;
  }

  const nextService: Service = {
    ...currentService,
    ...patch,
    id,
    updatedAt
  };

  store.services[index] = nextService;

  return clone(nextService);
};

export const deleteAdminService = async (id: string) => {
  if (isMongoConfigured()) {
    const collection = await useServicesCollection();
    const result = await collection.deleteOne(byId<Service>(id));
    return result.deletedCount > 0;
  }

  const store = getMemoryStore();
  const initialLength = store.services.length;
  store.services = store.services.filter((service) => service.id !== id);

  return store.services.length !== initialLength;
};

export const listAdminProjectRequests = async () => {
  if (isMongoConfigured()) {
    const collection = await useProjectRequestsCollection();
    return collection.find({}).sort({ createdAt: -1 }).toArray();
  }

  return clone(sortByUpdatedAt(getMemoryStore().projectRequests));
};

export const createProjectRequestRecord = async (request: ProjectRequest) => {
  if (isMongoConfigured()) {
    const collection = await useProjectRequestsCollection();
    await collection.insertOne(request as OptionalUnlessRequiredId<ProjectRequest>);
    return request;
  }

  getMemoryStore().projectRequests.unshift(request);
  return clone(request);
};

export const updateAdminProjectRequest = async (id: string, patch: Partial<ProjectRequest>) => {
  const updatedAt = getNow();

  if (isMongoConfigured()) {
    const collection = await useProjectRequestsCollection();
    await collection.updateOne(byId<ProjectRequest>(id), { $set: { ...patch, updatedAt } });
    return collection.findOne(byId<ProjectRequest>(id));
  }

  const store = getMemoryStore();
  const index = store.projectRequests.findIndex((request) => request.id === id);

  if (index < 0) {
    return null;
  }

  const currentRequest = store.projectRequests[index];

  if (!currentRequest) {
    return null;
  }

  const nextRequest: ProjectRequest = {
    ...currentRequest,
    ...patch,
    id,
    updatedAt
  };

  store.projectRequests[index] = nextRequest;

  return clone(nextRequest);
};

export const deleteAdminProjectRequest = async (id: string) => {
  if (isMongoConfigured()) {
    const collection = await useProjectRequestsCollection();
    const result = await collection.deleteOne(byId<ProjectRequest>(id));
    return result.deletedCount > 0;
  }

  const store = getMemoryStore();
  const initialLength = store.projectRequests.length;
  store.projectRequests = store.projectRequests.filter((request) => request.id !== id);

  return store.projectRequests.length !== initialLength;
};

export const getAdminSiteSettings = async () => {
  if (isMongoConfigured()) {
    const collection = await useSiteSettingsCollection();
    const settings = await collection.findOne({ key: 'publicContact' });

    return settings || createDefaultSiteSettings();
  }

  return clone(getMemoryStore().siteSettings);
};

export const updateAdminSiteSettings = async (contact: PublicContactSettings) => {
  const existingSettings = await getAdminSiteSettings();
  const nextSettings: SiteSettings = {
    ...existingSettings,
    id: existingSettings.id || 'settings_public_contact',
    key: 'publicContact',
    contact,
    updatedAt: getNow(),
    createdAt: existingSettings.createdAt || getNow()
  };

  if (isMongoConfigured()) {
    const collection = await useSiteSettingsCollection();
    await collection.updateOne(
      { key: 'publicContact' },
      { $set: nextSettings },
      { upsert: true }
    );
    return nextSettings;
  }

  getMemoryStore().siteSettings = nextSettings;
  return clone(nextSettings);
};

export const localizeString = (value: { en?: string; fa?: string } | undefined, locale: LocaleCode = 'en') => {
  return value?.[locale] || value?.en || value?.fa || '';
};
