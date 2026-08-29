import { requireAdminSession } from '../../../utils/admin-auth';
import { listAdminProjectRequests } from '../../../utils/admin-data';
import { requestStatuses } from '../../../utils/admin-input';
import type { ProjectRequestStatus } from '~~/types';

export default defineEventHandler(async (event) => {
  requireAdminSession(event);

  const query = getQuery(event);
  const status = typeof query.status === 'string' && requestStatuses.includes(query.status as ProjectRequestStatus)
    ? query.status as ProjectRequestStatus
    : undefined;
  const requests = await listAdminProjectRequests();

  return {
    requests: status ? requests.filter((request) => request.status === status) : requests,
    statuses: requestStatuses
  };
});
