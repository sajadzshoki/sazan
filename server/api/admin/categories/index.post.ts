import { requireAdminSession } from '../../../utils/admin-auth';
import { createAdminCategory, listAdminCategories } from '../../../utils/admin-data';
import { parseCategoryInput, safeError } from '../../../utils/admin-input';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  const category = parseCategoryInput(await readBody(event));
  const existing = await listAdminCategories();

  if (existing.some((item) => item.slug === category.slug || item.id === category.id)) {
    throw safeError(409, 'A category with this slug already exists');
  }

  return {
    ok: true,
    category: await createAdminCategory(category)
  };
});
