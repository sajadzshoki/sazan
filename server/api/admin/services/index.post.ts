import { requireAdminSession } from '../../../utils/admin-auth';
import { createAdminService, listAdminServices } from '../../../utils/admin-data';
import { parseServiceInput, safeError } from '../../../utils/admin-input';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  const service = parseServiceInput(await readBody(event));
  const existing = await listAdminServices();

  if (existing.some((item) => item.slug === service.slug || item.id === service.id)) {
    throw safeError(409, 'A service with this slug already exists');
  }

  return {
    ok: true,
    service: await createAdminService(service)
  };
});
