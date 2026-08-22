import { logger } from '@krishisetu/observability';

export function startWorker(): void {
  logger.info('KrishiSetu Worker composition initialized (dormant in prototype mode).');
}

export * from './worker';
