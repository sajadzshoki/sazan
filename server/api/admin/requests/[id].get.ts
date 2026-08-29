import { requireAdminSession } from '../../../utils/admin-auth';
import { listAdminProjectRequests } from '../../../utils/admin-data';
import { safeError } from '../../../utils/admin-input';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  const id = getRouterParam(event, 'id');
  const request = (await listAdminProjectRequests()).find((item) => item.id === id);

  if (!request) {
    throw safeError(404, 'Project request not found');
  }

  return { request };
});
