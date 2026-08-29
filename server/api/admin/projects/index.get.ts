import { requireAdminSession } from '../../../utils/admin-auth';
import { listAdminCategories, listAdminProjects, listAdminServices } from '../../../utils/admin-data';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  const [projects, categories, services] = await Promise.all([
    listAdminProjects(),
    listAdminCategories(),
    listAdminServices()
  ]);

  return {
    projects,
    categories,
    services
  };
});
