import { requireAdminSession } from '../../utils/admin-auth';
import { updateAdminSiteSettings } from '../../utils/admin-data';
import { parseSettingsInput } from '../../utils/admin-input';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  const contact = parseSettingsInput(await readBody(event));

  return {
    ok: true,
    settings: await updateAdminSiteSettings(contact)
  };
});
