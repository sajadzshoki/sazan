import { requireAdminSession } from '../../utils/admin-auth';
import { getAdminSiteSettings } from '../../utils/admin-data';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  return {
    settings: await getAdminSiteSettings()
  };
});
