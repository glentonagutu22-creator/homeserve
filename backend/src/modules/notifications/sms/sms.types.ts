export type SmsRecipient = string | string[];

export type SendSmsParams = {
  to: SmsRecipient;
  message: string;
};