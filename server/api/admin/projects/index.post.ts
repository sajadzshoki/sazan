import { createAdminProject, listAdminProjects } from '../../../utils/admin-data';
import { requireAdminSession } from '../../../utils/admin-auth';
import { parseProjectInput, safeError } from '../../../utils/admin-input';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  const project = parseProjectInput(await readBody(event));
  const existing = await listAdminProjects();

  if (existing.some((item) => item.slug === project.slug || item.id === project.id)) {
    throw safeError(409, 'A project with this slug already exists');
  }

  const created = await createAdminProject(project);

  return {
    ok: true,
    project: created
  };
});
