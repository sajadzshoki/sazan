import { requireAdminSession } from '../../../utils/admin-auth';
import { listAdminCategories, listAdminProjects, listAdminServices } from '../../../utils/admin-data';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  const id = getRouterParam(event, 'id');
  const [projects, categories, services] = await Promise.all([
    listAdminProjects(),
    listAdminCategories(),
    listAdminServices()
  ]);
  const project = projects.find((item) => item.id === id);

  if (!project) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' });
  }

  return {
    project,
    categories,
    services
  };
});
