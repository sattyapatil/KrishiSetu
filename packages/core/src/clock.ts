export interface Clock {
  now(): Date;
  isoString(): string;
}

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }

  isoString(): string {
    return this.now().toISOString();
  }
}

export class FixedClock implements Clock {
  private currentTime: Date;

  constructor(initialTime: Date | string = '2026-08-22T09:00:00.000Z') {
    this.currentTime = typeof initialTime === 'string' ? new Date(initialTime) : initialTime;
  }

  now(): Date {
    return new Date(this.currentTime.getTime());
  }

  isoString(): string {
    return this.now().toISOString();
  }

  advanceByMs(ms: number): void {
    this.currentTime = new Date(this.currentTime.getTime() + ms);
  }

  setTime(time: Date | string): void {
    this.currentTime = typeof time === 'string' ? new Date(time) : time;
  }
}
