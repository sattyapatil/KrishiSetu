export interface NotificationIntent {
  readonly id: string;
  readonly userId: string;
  readonly messageKey: string;
  readonly params?: Record<string, string | number>;
  readonly createdAt: string;
}
