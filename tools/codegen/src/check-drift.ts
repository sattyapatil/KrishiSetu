import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateTokensCss } from './generate-tokens';
import { generateMessageKeys } from './generate-message-keys';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function checkDrift(): boolean {
  const rootDir = path.resolve(__dirname, '../../../');
  let hasDrift = false;

  // 1. Check tokens CSS drift
  const expectedTokensCss = generateTokensCss();
  const tokensCssPath = path.join(rootDir, 'packages/design-tokens/generated/krishisetu.tokens.css');
  if (!fs.existsSync(tokensCssPath)) {
    console.error('FAIL: packages/design-tokens/generated/krishisetu.tokens.css is missing.');
    hasDrift = true;
  } else {
    const currentTokensCss = fs.readFileSync(tokensCssPath, 'utf8');
    if (currentTokensCss.trim() !== expectedTokensCss.trim()) {
      console.error('FAIL: Drift detected in packages/design-tokens/generated/krishisetu.tokens.css');
      hasDrift = true;
    }
  }

  // 2. Check message keys drift
  const expectedMessageKeys = generateMessageKeys();
  const messageKeysPath = path.join(rootDir, 'packages/i18n/src/generated/message-keys.ts');
  if (!fs.existsSync(messageKeysPath)) {
    console.error('FAIL: packages/i18n/src/generated/message-keys.ts is missing.');
    hasDrift = true;
  } else {
    const currentMessageKeys = fs.readFileSync(messageKeysPath, 'utf8');
    if (currentMessageKeys.trim() !== expectedMessageKeys.trim()) {
      console.error('FAIL: Drift detected in packages/i18n/src/generated/message-keys.ts');
      hasDrift = true;
    }
  }

  if (hasDrift) {
    console.error('\nCodegen drift check FAILED. Run `npm run codegen` to refresh generated files.');
    return false;
  }

  console.log('PASS: All generated files are up to date with zero drift.');
  return true;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ok = checkDrift();
  if (!ok) {
    process.exit(1);
  }
}
