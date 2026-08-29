import { requireAdminSession } from '../../../utils/admin-auth';
import { listAdminCategories } from '../../../utils/admin-data';
import { safeError } from '../../../utils/admin-input';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  const id = getRouterParam(event, 'id');
  const category = (await listAdminCategories()).find((item) => item.id === id);

  if (!category) {
    throw safeError(404, 'Category not found');
  }

  return { category };
});
