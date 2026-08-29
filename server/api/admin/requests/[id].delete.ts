import { requireAdminSession } from '../../../utils/admin-auth';
import { deleteAdminProjectRequest } from '../../../utils/admin-data';
import { safeError } from '../../../utils/admin-input';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  const id = getRouterParam(event, 'id');

  if (!id) {
    throw safeError(400, 'Project request id is required');
  }

  const deleted = await deleteAdminProjectRequest(id);

  if (!deleted) {
    throw safeError(404, 'Project request not found');
  }

  return { ok: true };
});
