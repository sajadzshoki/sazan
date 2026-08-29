import { requireAdminSession } from '../../../utils/admin-auth';
import { listAdminProjects, updateAdminProject } from '../../../utils/admin-data';
import { parseProjectInput, safeError } from '../../../utils/admin-input';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  const id = getRouterParam(event, 'id');

  if (!id) {
    throw safeError(400, 'Project id is required');
  }

  const project = parseProjectInput(await readBody(event));
  const projects = await listAdminProjects();

  if (projects.some((item) => item.id !== id && item.slug === project.slug)) {
    throw safeError(409, 'A project with this slug already exists');
  }

  const updated = await updateAdminProject(id, { ...project, id });

  if (!updated) {
    throw safeError(404, 'Project not found');
  }

  return {
    ok: true,
    project: updated
  };
});
