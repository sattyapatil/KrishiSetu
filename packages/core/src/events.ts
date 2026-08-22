export interface IntegrationEvent<TType extends string = string, TPayload = unknown> {
  readonly id: string;
  readonly type: TType;
  readonly version: 1;
  readonly occurredAt: string;
  readonly correlationId: string;
  readonly causationId?: string;
  readonly producer: string;
  readonly payload: TPayload;
}

export interface EventPublisher {
  publish<TType extends string, TPayload>(
    event: IntegrationEvent<TType, TPayload>
  ): Promise<void>;
  publishAll(events: ReadonlyArray<IntegrationEvent>): Promise<void>;
}

export class InMemoryEventBus implements EventPublisher {
  private handlers = new Map<string, Array<(event: IntegrationEvent) => Promise<void> | void>>();
  readonly publishedEvents: IntegrationEvent[] = [];

  subscribe<TType extends string, TPayload>(
    type: TType,
    handler: (event: IntegrationEvent<TType, TPayload>) => Promise<void> | void
  ): () => void {
    const list = this.handlers.get(type) ?? [];
    list.push(handler as (event: IntegrationEvent) => Promise<void> | void);
    this.handlers.set(type, list);

    return () => {
      const current = this.handlers.get(type) ?? [];
      this.handlers.set(
        type,
        current.filter((h) => h !== handler)
      );
    };
  }

  async publish<TType extends string, TPayload>(
    event: IntegrationEvent<TType, TPayload>
  ): Promise<void> {
    this.publishedEvents.push(event);
    const handlers = this.handlers.get(event.type) ?? [];
    for (const handler of handlers) {
      await handler(event);
    }
  }

  async publishAll(events: ReadonlyArray<IntegrationEvent>): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  clear(): void {
    this.publishedEvents.length = 0;
    this.handlers.clear();
  }
}
