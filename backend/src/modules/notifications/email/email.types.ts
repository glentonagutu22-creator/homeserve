export type EmailRecipient = string | string[];

export type SendEmailParams = {
  to: EmailRecipient;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  idempotencyKey?: string;
};