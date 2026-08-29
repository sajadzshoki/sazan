import type { Collection } from 'mongodb';
import type { Category, ContactMessage, Project, ProjectRequest, Service } from '~~/types';
import { getMongoDatabase } from '../utils/mongodb';

export const collectionNames = {
  projects: 'projects',
  categories: 'categories',
  services: 'services',
  projectRequests: 'project_requests',
  contactMessages: 'contact_messages'
} as const;

const useCollection = async <T extends object>(name: string): Promise<Collection<T>> => {
  const database = await getMongoDatabase();

  return database.collection<T>(name);
};

export const useProjectsCollection = () => useCollection<Project>(collectionNames.projects);
export const useCategoriesCollection = () => useCollection<Category>(collectionNames.categories);
export const useServicesCollection = () => useCollection<Service>(collectionNames.services);
export const useProjectRequestsCollection = () => useCollection<ProjectRequest>(collectionNames.projectRequests);
export const useContactMessagesCollection = () => useCollection<ContactMessage>(collectionNames.contactMessages);
