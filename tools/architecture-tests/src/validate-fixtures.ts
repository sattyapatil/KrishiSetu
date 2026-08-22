import { SYNTHETIC_DEMO_FARMERS } from '@krishisetu/testing';

export function validateFixtures(): boolean {
  console.log('Validating synthetic fixture invariants...');
  let hasErrors = false;

  for (const farmer of SYNTHETIC_DEMO_FARMERS) {
    if (!farmer.synthetic) {
      console.error(`FAIL: Farmer ${farmer.farmerId} missing synthetic: true`);
      hasErrors = true;
    }

    if (!/^272026\d{8}$/.test(farmer.farmerId)) {
      console.error(`FAIL: Farmer ID ${farmer.farmerId} is outside synthetic range 27202600000001-27202600000099`);
      hasErrors = true;
    }

    const num = Number.parseInt(farmer.farmerId.slice(6), 10);
    if (num < 1 || num > 99) {
      console.error(`FAIL: Farmer ID suffix ${num} is outside synthetic range 01-99`);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error('Fixture validation FAILED.');
    return false;
  }

  console.log('PASS: All synthetic fixtures meet strict safety invariants.');
  return true;
}

if (process.argv[1] && process.argv[1].endsWith('validate-fixtures.ts')) {
  const ok = validateFixtures();
  if (!ok) process.exit(1);
}
