import { requireAdminSession } from '../../../utils/admin-auth';
import { updateAdminProjectRequest } from '../../../utils/admin-data';
import { parseRequestStatusInput, safeError } from '../../../utils/admin-input';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  const id = getRouterParam(event, 'id');

  if (!id) {
    throw safeError(400, 'Project request id is required');
  }

  const status = parseRequestStatusInput(await readBody(event));
  const updated = await updateAdminProjectRequest(id, { status });

  if (!updated) {
    throw safeError(404, 'Project request not found');
  }

  return {
    ok: true,
    request: updated
  };
});
