import { getAdminSiteSettings } from '../utils/admin-data';

export default defineEventHandler(async () => {
  const settings = await getAdminSiteSettings();

  return {
    contact: settings.contact,
    updatedAt: settings.updatedAt
  };
});
