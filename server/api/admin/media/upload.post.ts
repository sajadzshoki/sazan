import { requireAdminSession } from '../../../utils/admin-auth';
import { saveMediaPart } from '../../../utils/storage';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  const form = await readMultipartFormData(event);
  const file = form?.find((part) => part.name === 'file' && part.filename && part.data);

  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'A media file is required' });
  }

  const asset = await saveMediaPart({
    data: file.data,
    ...(file.filename ? { filename: file.filename } : {}),
    ...(file.type ? { type: file.type } : {})
  });

  return {
    ok: true,
    asset
  };
});
