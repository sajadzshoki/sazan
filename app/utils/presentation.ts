import type { PortfolioCategoryKey, PortfolioMedia } from '~/data/projects';

export type DeviceType = 'laptop' | 'tablet' | 'phone';

export const previewDevicesFor = (category: PortfolioCategoryKey): DeviceType[] => {
  if (category === 'mobileApps') {
    return ['phone'];
  }

  if (category === 'adminPanels' || category === 'backendSystems') {
    return ['laptop', 'tablet'];
  }

  return ['laptop', 'tablet', 'phone'];
};

export const screenshotFor = (media: PortfolioMedia | undefined, device: DeviceType) => {
  if (!media) {
    return undefined;
  }

  if (device === 'laptop') {
    return media.desktop;
  }

  if (device === 'tablet') {
    return media.tablet;
  }

  return media.mobile;
};
