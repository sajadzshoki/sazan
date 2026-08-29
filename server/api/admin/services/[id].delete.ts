import { requireAdminSession } from '../../../utils/admin-auth';
import { deleteAdminService } from '../../../utils/admin-data';
import { safeError } from '../../../utils/admin-input';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  const id = getRouterParam(event, 'id');

  if (!id) {
    throw safeError(400, 'Service id is required');
  }

  const deleted = await deleteAdminService(id);

  if (!deleted) {
    throw safeError(404, 'Service not found');
  }

  return { ok: true };
});
