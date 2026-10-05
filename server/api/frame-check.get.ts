import { isAllowedProjectUrl } from '../../app/utils/frame-embed';

const blocksFraming = (headers: Headers) => {
  const frameOptions = headers.get('x-frame-options') || '';

  if (/deny|sameorigin/i.test(frameOptions)) {
    return true;
  }

  const policy = headers.get('content-security-policy') || '';
  const ancestors = policy.match(/frame-ancestors\s+([^;]+)/i);

  if (!ancestors) {
    return false;
  }

  const value = ancestors[1].toLowerCase();

  return !value.includes('*') && !value.includes('188.121.107.118');
};

export default defineEventHandler(async (event) => {
  const rawUrl = String(getQuery(event).url || '');

  if (!isAllowedProjectUrl(rawUrl)) {
    return { embeddable: false };
  }

  try {
    const response = await fetch(rawUrl, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(8000)
    });
    const finalUrl = new URL(response.url || rawUrl);

    if (!isAllowedProjectUrl(finalUrl.origin + finalUrl.pathname)) {
      return { embeddable: false };
    }

    return { embeddable: !blocksFraming(response.headers) };
  } catch {
    return { embeddable: true };
  }
});
