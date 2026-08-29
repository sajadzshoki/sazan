import { requireAdminSession } from '../../../utils/admin-auth';
import { listAdminCategories } from '../../../utils/admin-data';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  return {
    categories: await listAdminCategories()
  };
});
