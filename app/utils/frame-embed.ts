const allowedPorts = new Set(['3001', '3002', '3003', '3004', '3005', '3006', '3007', '3008', '3009', '3010', '3011']);

export const isAllowedProjectUrl = (value: string) => {
  try {
    const url = new URL(value);

    return url.protocol === 'http:' && url.hostname === '188.121.107.118' && allowedPorts.has(url.port);
  } catch {
    return false;
  }
};
