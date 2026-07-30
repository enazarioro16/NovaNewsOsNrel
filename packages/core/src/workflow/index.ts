// Workflow
export interface IWorkflowContext {
  workflowId: string;
  state: Record<string, any>;
}

export interface IWorkflowEngine {
  startWorkflow(name: string, payload: any): Promise<string>;
  resumeWorkflow(workflowId: string, eventName: string, payload: any): Promise<void>;
}

// Notifications
export interface INotificationPayload {
  recipientId: string;
  channel: 'email' | 'push' | 'in-app';
  subject: string;
  body: string;
}

export interface INotificationProvider {
  send(notification: INotificationPayload): Promise<void>;
  sendBatch(notifications: INotificationPayload[]): Promise<void>;
}
