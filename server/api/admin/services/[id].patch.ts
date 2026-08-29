import { requireAdminSession } from '../../../utils/admin-auth';
import { listAdminServices, updateAdminService } from '../../../utils/admin-data';
import { parseServiceInput, safeError } from '../../../utils/admin-input';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  const id = getRouterParam(event, 'id');

  if (!id) {
    throw safeError(400, 'Service id is required');
  }

  const service = parseServiceInput(await readBody(event));
  const services = await listAdminServices();

  if (services.some((item) => item.id !== id && item.slug === service.slug)) {
    throw safeError(409, 'A service with this slug already exists');
  }

  const updated = await updateAdminService(id, { ...service, id });

  if (!updated) {
    throw safeError(404, 'Service not found');
  }

  return {
    ok: true,
    service: updated
  };
});
