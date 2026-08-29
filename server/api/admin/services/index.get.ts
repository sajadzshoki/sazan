import { requireAdminSession } from '../../../utils/admin-auth';
import { listAdminServices } from '../../../utils/admin-data';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  return {
    services: await listAdminServices()
  };
});
