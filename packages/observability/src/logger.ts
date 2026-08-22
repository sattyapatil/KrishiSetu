import { sanitizeLogPayload } from './redaction.js';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface StructuredLogRecord {
  readonly level: LogLevel;
  readonly message: string;
  readonly timestamp: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly module?: string;
  readonly details?: Record<string, unknown>;
}

export class Logger {
  private moduleName: string;

  constructor(moduleName = 'krishisetu') {
    this.moduleName = moduleName;
  }

  private log(
    level: LogLevel,
    message: string,
    context?: { correlationId?: string; requestId?: string; details?: Record<string, unknown> }
  ): void {
    const record: StructuredLogRecord = {
      level,
      message,
      timestamp: new Date().toISOString(),
      module: this.moduleName,
      correlationId: context?.correlationId,
      requestId: context?.requestId,
      details: context?.details ? sanitizeLogPayload(context.details) : undefined,
    };

    const output = JSON.stringify(record);
    if (level === 'error') {
      console.error(output);
    } else if (level === 'warn') {
      console.warn(output);
    } else {
      console.log(output);
    }
  }

  info(message: string, context?: { correlationId?: string; requestId?: string; details?: Record<string, unknown> }): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: { correlationId?: string; requestId?: string; details?: Record<string, unknown> }): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: { correlationId?: string; requestId?: string; details?: Record<string, unknown> }): void {
    this.log('error', message, context);
  }

  debug(message: string, context?: { correlationId?: string; requestId?: string; details?: Record<string, unknown> }): void {
    this.log('debug', message, context);
  }
}

export const logger = new Logger('root');
