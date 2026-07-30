export interface IAnalyticsEvent {
  eventName: string;
  userId?: string;
  sessionId?: string;
  properties: Record<string, any>;
  timestamp: Date;
}

export interface IAnalyticsProvider {
  track(event: IAnalyticsEvent): Promise<void>;
  identify(userId: string, traits: Record<string, any>): Promise<void>;
}
