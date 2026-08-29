import { requireAdminSession } from '../../../utils/admin-auth';
import { getMediaProviderStatus } from '../../../utils/storage';

export default defineEventHandler((event) => {
  requireAdminSession(event);

  return getMediaProviderStatus();
});
