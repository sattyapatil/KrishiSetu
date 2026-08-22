import { productConfig, moduleRegistry } from '@krishisetu/config';
import { localeRegistry } from '@krishisetu/i18n';
import { logger } from '@krishisetu/observability';

export interface KrishiSetuApp {
  readonly name: string;
  readonly getLiveStatus: () => { status: string; uptime: number; prototype: true };
  readonly getReadyStatus: () => { status: string; modules: Record<string, boolean>; prototype: true };
  readonly getMetaLocales: () => typeof localeRegistry;
  readonly getMetaModules: () => typeof moduleRegistry;
}

export function createApp(): KrishiSetuApp {
  logger.info('Creating KrishiSetu API application instance');

  return {
    name: productConfig.name,
    getLiveStatus: () => ({
      status: 'UP',
      uptime: process.uptime(),
      prototype: true,
    }),
    getReadyStatus: () => {
      const statusMap: Record<string, boolean> = {};
      for (const [mod, def] of Object.entries(moduleRegistry)) {
        statusMap[mod] = def.enabled;
      }
      return {
        status: 'READY',
        modules: statusMap,
        prototype: true,
      };
    },
    getMetaLocales: () => localeRegistry,
    getMetaModules: () => moduleRegistry,
  };
}
