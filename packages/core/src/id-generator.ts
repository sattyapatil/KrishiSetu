import { randomUUID } from 'node:crypto';

export interface IdGenerator {
  nextUuid(): string;
  nextPrefixedId(prefix: string): string;
}

export class CryptoIdGenerator implements IdGenerator {
  nextUuid(): string {
    return randomUUID();
  }

  nextPrefixedId(prefix: string): string {
    const raw = randomUUID().replace(/-/g, '').slice(0, 12);
    return `${prefix}_${raw}`;
  }
}

export class DeterministicIdGenerator implements IdGenerator {
  private counter: number;
  private prefixSeed: string;

  constructor(prefixSeed = 'test', startCount = 1) {
    this.prefixSeed = prefixSeed;
    this.counter = startCount;
  }

  nextUuid(): string {
    const countStr = this.counter.toString().padStart(12, '0');
    this.counter += 1;
    return `00000000-0000-4000-8000-${countStr}`;
  }

  nextPrefixedId(prefix: string): string {
    const countStr = this.counter.toString().padStart(6, '0');
    this.counter += 1;
    return `${prefix}_${this.prefixSeed}_${countStr}`;
  }

  reset(startCount = 1): void {
    this.counter = startCount;
  }
}
