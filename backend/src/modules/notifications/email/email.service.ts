import { Resend } from "resend";

import type { SendEmailParams } from "./email.types";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const EMAIL_FROM =
  process.env.EMAIL_FROM ||
  "HomeServe <onboarding@resend.dev>";

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
  idempotencyKey,
}: SendEmailParams) {
  const { data, error } =
    await resend.emails.send(
      {
        from: EMAIL_FROM,
        to,
        subject,
        html,
        ...(text ? { text } : {}),
        ...(replyTo ? { replyTo } : {}),
      },
      idempotencyKey
        ? {
            idempotencyKey,
          }
        : undefined
    );

  if (error) {
    console.error(
      "Email delivery failed:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to send email."
    );
  }
console.log("RESEND EMAIL RESPONSE:", data);
  return data;
}