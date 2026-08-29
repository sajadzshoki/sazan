import { requireAdminSession } from '../../utils/admin-auth';
import { adminDataStatus, listAdminCategories, listAdminProjectRequests, listAdminProjects, listAdminServices } from '../../utils/admin-data';
import { getMediaProviderStatus } from '../../utils/storage';

export default defineEventHandler(async (event) => {
  const session = requireAdminSession(event);
  const [projects, categories, services, requests] = await Promise.all([
    listAdminProjects(),
    listAdminCategories(),
    listAdminServices(),
    listAdminProjectRequests()
  ]);

  const newRequests = requests.filter((request) => request.status === 'new');

  return {
    admin: {
      email: session.email,
      expiresAt: session.expiresAt
    },
    data: adminDataStatus(),
    media: getMediaProviderStatus(),
    counts: {
      projects: projects.length,
      publishedProjects: projects.filter((project) => project.status === 'published').length,
      categories: categories.length,
      services: services.length,
      projectRequests: requests.length,
      newProjectRequests: newRequests.length
    },
    recentProjects: projects.slice(0, 5),
    recentRequests: requests.slice(0, 5)
  };
});
