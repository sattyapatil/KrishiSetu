import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Validator Negative Tests', () => {
  it('detects live government and bank URLs in code', () => {
    const liveHostRegex = /(https?:\/\/[^\s\"']*\.(gov|nic)\.in|aadhaar\.gov\.in|npci\.org\.in)/;
    assert.equal(liveHostRegex.test('https://mahabhumi.gov.in/api/v1'), true);
    assert.equal(liveHostRegex.test('https://pmkisan.nic.in/status'), true);
    assert.equal(liveHostRegex.test('https://resident.aadhaar.gov.in'), true);
    assert.equal(liveHostRegex.test('https://api.npci.org.in/upi'), true);
    assert.equal(liveHostRegex.test('https://localhost:3000/api/v1'), false);
    assert.equal(liveHostRegex.test('/mock/mahabhumi/v1/land-holdings'), false);
  });

  it('detects deep imports into package src internals', () => {
    const deepImportPattern = /from\s+['"]@krishisetu\/[^'"]+\/src\//;
    assert.equal(deepImportPattern.test('from "' + '@krishisetu/' + 'core/src/result' + '"'), true);
    assert.equal(deepImportPattern.test('from "' + '@krishisetu/' + 'core' + '"'), false);
  });

  it('detects raw hex colors outside var() fallback wrappers', () => {
    const isRawHex = (content: string) => {
      const noComments = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
      const stripped = noComments.replace(/var\(--ks-color-[^,)]+,\s*#[0-9A-Fa-f]{3,8}\)/g, '');
      return /#[0-9A-Fa-f]{3,8}\b/.test(stripped);
    };

    assert.equal(isRawHex('const color = "#1e3a8a";'), true);
    assert.equal(isRawHex('style={{ color: "var(--ks-color-civic-blue, #1e3a8a)" }}'), false);
    assert.equal(isRawHex('style={{ borderColor: "#86efac" }}'), true);
  });

  it('detects direct process.env access', () => {
    const envRegex = /\bprocess\.env\b/;
    assert.equal(envRegex.test('const x = process.env.NODE_ENV;'), true);
    assert.equal(envRegex.test('const x = env.nodeEnv;'), false);
  });
});
