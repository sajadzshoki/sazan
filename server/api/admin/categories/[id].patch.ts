import { requireAdminSession } from '../../../utils/admin-auth';
import { listAdminCategories, updateAdminCategory } from '../../../utils/admin-data';
import { parseCategoryInput, safeError } from '../../../utils/admin-input';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  const id = getRouterParam(event, 'id');

  if (!id) {
    throw safeError(400, 'Category id is required');
  }

  const category = parseCategoryInput(await readBody(event));
  const categories = await listAdminCategories();

  if (categories.some((item) => item.id !== id && item.slug === category.slug)) {
    throw safeError(409, 'A category with this slug already exists');
  }

  const updated = await updateAdminCategory(id, { ...category, id });

  if (!updated) {
    throw safeError(404, 'Category not found');
  }

  return {
    ok: true,
    category: updated
  };
});
