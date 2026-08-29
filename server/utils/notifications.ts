import type { ProjectRequest } from '~~/types';

type NotificationContext = {
  reference: string;
  requestUrl?: string;
};

type NotificationResult = {
  provider: string;
  ok: boolean;
  skipped?: boolean;
  error?: string;
};

type NotificationProvider = {
  name: string;
  isConfigured: () => boolean;
  sendProjectRequest: (request: ProjectRequest, context: NotificationContext) => Promise<NotificationResult>;
};

const toSafeNotificationSummary = (request: ProjectRequest, context: NotificationContext) => ({
  reference: context.reference,
  locale: request.preferredLocale,
  status: request.status,
  projectTypes: request.selectedProjectTypes,
  requestedFeatures: request.requestedFeatures,
  budgetRange: request.budgetRange,
  timeline: request.timeline,
  contact: {
    fullName: request.contact.fullName,
    email: request.contact.email,
    company: request.contact.company,
    preferredContactMethod: request.contact.preferredContactMethod
  },
  createdAt: request.createdAt
});

const createWebhookProvider = (): NotificationProvider => {
  const config = useRuntimeConfig();
  const webhookUrl = String(process.env.NOTIFICATION_WEBHOOK_URL || config.notifications.webhookUrl || '');
  const webhookToken = String(process.env.NOTIFICATION_WEBHOOK_TOKEN || config.notifications.webhookToken || '');
  const providerName = String(process.env.NOTIFICATION_WEBHOOK_PROVIDER_NAME || config.notifications.webhookProviderName || 'webhook');

  return {
    name: providerName,
    isConfigured: () => Boolean(webhookUrl),
    async sendProjectRequest(request, context) {
      if (!webhookUrl) {
        return {
          provider: this.name,
          ok: true,
          skipped: true
        };
      }

      const headers: Record<string, string> = {
        'content-type': 'application/json'
      };

      if (webhookToken) {
        headers.authorization = `Bearer ${webhookToken}`;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: 'project_request.created',
          data: toSafeNotificationSummary(request, context)
        })
      });

      if (!response.ok) {
        throw new Error(`Webhook responded with ${response.status}`);
      }

      return {
        provider: this.name,
        ok: true
      };
    }
  };
};

const logDevelopmentFallback = (request: ProjectRequest, context: NotificationContext) => {
  console.info('[SAZAN notification:fallback] Project request received', toSafeNotificationSummary(request, context));
};

export const notifyProjectRequest = async (request: ProjectRequest, context: NotificationContext): Promise<NotificationResult[]> => {
  const providers = [createWebhookProvider()];
  const configuredProviders = providers.filter((provider) => provider.isConfigured());

  if (configuredProviders.length === 0) {
    if (process.env.NODE_ENV !== 'production') {
      logDevelopmentFallback(request, context);
    }

    return [
      {
        provider: 'development-log',
        ok: true,
        skipped: true
      }
    ];
  }

  const results = await Promise.all(configuredProviders.map(async (provider) => {
    try {
      return await provider.sendProjectRequest(request, context);
    } catch (error) {
      console.error(`[SAZAN notification:${provider.name}] Failed to send project request notification`, error);

      return {
        provider: provider.name,
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown notification error'
      };
    }
  }));

  return results;
};
