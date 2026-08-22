const SENSITIVE_KEY_PATTERNS = [
  /pin/i,
  /password/i,
  /secret/i,
  /token/i,
  /jwt/i,
  /cookie/i,
  /session/i,
  /account.*number/i,
  /authorization/i,
];

export function redactValue(key: string, value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  // Check key against sensitive patterns
  for (const pattern of SENSITIVE_KEY_PATTERNS) {
    if (pattern.test(key)) {
      return '[REDACTED]';
    }
  }

  if (typeof value === 'string') {
    // Mask 14-digit Farmer ID if present
    if (/^\d{14}$/.test(value)) {
      return `••••••••••${value.slice(-4)}`;
    }
  }

  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.map((item, idx) => redactValue(String(idx), item));
    }
    const sanitized: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      sanitized[k] = redactValue(k, v);
    }
    return sanitized;
  }

  return value;
}

export function sanitizeLogPayload<T>(payload: T): T {
  return redactValue('root', payload) as T;
}
