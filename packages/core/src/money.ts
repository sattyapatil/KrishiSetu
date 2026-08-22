import { DomainError, Result, err, ok } from './result.js';

/**
 * Money value object representing monetary values in integer paise.
 * Strictly prevents floating-point financial arithmetic.
 */
export class Money {
  readonly paise: bigint;

  private constructor(paise: bigint) {
    this.paise = paise;
  }

  static fromPaise(paise: number | bigint): Result<Money, DomainError> {
    if (typeof paise === 'number') {
      if (!Number.isSafeInteger(paise)) {
        return err({
          code: 'INVALID_MONEY_AMOUNT',
          messageKey: 'errors.money.invalidInteger',
          details: { amount: paise },
          retryable: false,
        });
      }
      return ok(new Money(BigInt(paise)));
    }
    return ok(new Money(paise));
  }

  static zero(): Money {
    return new Money(0n);
  }

  add(other: Money): Money {
    return new Money(this.paise + other.paise);
  }

  subtract(other: Money): Result<Money, DomainError> {
    const result = this.paise - other.paise;
    if (result < 0n) {
      return err({
        code: 'NEGATIVE_MONEY_NOT_ALLOWED',
        messageKey: 'errors.money.negativeNotAllowed',
        details: { difference: Number(result) },
        retryable: false,
      });
    }
    return ok(new Money(result));
  }

  multiply(multiplier: number | bigint): Result<Money, DomainError> {
    if (typeof multiplier === 'number') {
      if (!Number.isSafeInteger(multiplier) || multiplier < 0) {
        return err({
          code: 'INVALID_MULTIPLIER',
          messageKey: 'errors.money.invalidMultiplier',
          details: { multiplier },
          retryable: false,
        });
      }
      return ok(new Money(this.paise * BigInt(multiplier)));
    }
    if (multiplier < 0n) {
      return err({
        code: 'INVALID_MULTIPLIER',
        messageKey: 'errors.money.invalidMultiplier',
        details: { multiplier: Number(multiplier) },
        retryable: false,
      });
    }
    return ok(new Money(this.paise * multiplier));
  }

  toPaiseNumber(): number {
    return Number(this.paise);
  }

  toRupeesString(): string {
    const isNegative = this.paise < 0n;
    const abs = isNegative ? -this.paise : this.paise;
    const rupees = abs / 100n;
    const paise = abs % 100n;
    const paiseStr = paise.toString().padStart(2, '0');
    return `${isNegative ? '-' : ''}${rupees}.${paiseStr}`;
  }

  equals(other: Money): boolean {
    return this.paise === other.paise;
  }
}
