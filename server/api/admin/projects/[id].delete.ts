import { requireAdminSession } from '../../../utils/admin-auth';
import { deleteAdminProject } from '../../../utils/admin-data';
import { safeError } from '../../../utils/admin-input';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  const id = getRouterParam(event, 'id');

  if (!id) {
    throw safeError(400, 'Project id is required');
  }

  const deleted = await deleteAdminProject(id);

  if (!deleted) {
    throw safeError(404, 'Project not found');
  }

  return {
    ok: true
  };
});
