import { fileURLToPath } from 'node:url';
import { writeGeneratedTokens } from './generate-tokens.js';
import { writeGeneratedMessageKeys } from './generate-message-keys.js';
import { writeGeneratedApiClient } from './generate-api-client.js';

export function runCodegen(): void {
  console.log('Running KrishiSetu single-source-of-truth codegen pipeline...');

  console.log('Generating design tokens CSS from JSON tokens...');
  writeGeneratedTokens();

  console.log('Generating typed message keys from canonical English catalogs...');
  writeGeneratedMessageKeys();

  console.log('Generating typed web API client from authoritative route contracts...');
  writeGeneratedApiClient();

  console.log('Codegen completed successfully.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCodegen();
}

export * from './generate-tokens.js';
export * from './generate-message-keys.js';
export * from './check-drift.js';
export * from './generate-api-client.js';
