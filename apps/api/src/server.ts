import Fastify from 'fastify';
import cors from '@fastify/cors';
import { createApp } from './app';
import { env, productConfig, moduleRegistry } from '@krishisetu/config';
import { localeRegistry } from '@krishisetu/i18n';
import { SYNTHETIC_DEMO_FARMERS } from '@krishisetu/testing';
import { logger } from '@krishisetu/observability';

export async function buildServer() {
  const fastify = Fastify({
    logger: false,
  });

  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });

  const app = createApp();

  // 1. Health checks
  fastify.get('/health/live', async () => {
    return app.getLiveStatus();
  });

  fastify.get('/health/ready', async () => {
    return app.getReadyStatus();
  });

  // 2. Metadata
  fastify.get('/api/v1/meta/product', async () => {
    return { data: productConfig };
  });

  fastify.get('/api/v1/meta/locales', async () => {
    return { data: localeRegistry };
  });

  fastify.get('/api/v1/meta/modules', async () => {
    return { data: moduleRegistry };
  });

  // 3. Demo Persona Allowlist
  fastify.get('/api/v1/demo/personas', async () => {
    return {
      data: SYNTHETIC_DEMO_FARMERS.map((f) => ({
        farmerId: f.farmerId,
        name: f.name,
        village: f.village,
        district: f.district,
        scenario: f.scenario,
        synthetic: f.synthetic,
      })),
    };
  });

  return fastify;
}

export async function startServer() {
  try {
    const server = await buildServer();
    const address = await server.listen({ port: env.port, host: env.host });
    logger.info(`KrishiSetu API running at ${address} (Prototype Mode: ${env.prototypeMode})`);
    console.log(`\n======================================================`);
    console.log(` KrishiSetu Fastify API Gateway running at:`);
    console.log(` ${address}`);
    console.log(` Health check: ${address}/health/live`);
    console.log(` Ready status: ${address}/health/ready`);
    console.log(` Meta locales: ${address}/api/v1/meta/locales`);
    console.log(`======================================================\n`);
  } catch (err) {
    logger.error('Failed to start KrishiSetu API server', { details: { err: String(err) } });
    process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].includes('server')) {
  startServer();
}

export * from './app';
