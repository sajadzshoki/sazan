import { requireAdminSession } from '../../../utils/admin-auth';
import { listAdminServices } from '../../../utils/admin-data';
import { safeError } from '../../../utils/admin-input';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  const id = getRouterParam(event, 'id');
  const service = (await listAdminServices()).find((item) => item.id === id);

  if (!service) {
    throw safeError(404, 'Service not found');
  }

  return { service };
});
