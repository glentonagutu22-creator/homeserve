import axios from "axios";

import type {
  SendSmsParams,
} from "./sms.types";

const INFOBIP_BASE_URL =
  process.env.INFOBIP_BASE_URL ||
  "https://api.infobip.com";

const INFOBIP_API_KEY =
  process.env.INFOBIP_API_KEY;
  

const INFOBIP_SENDER =
  process.env.INFOBIP_SENDER ||
  "ServiceSMS";

/*
|--------------------------------------------------------------------------
| Send SMS
|--------------------------------------------------------------------------
*/

/**
 * Send an SMS through Infobip.
 *
 * Provider-specific implementation lives here so
 * the rest of HomeServe does not need to know
 * anything about Infobip.
 */
export async function sendSms({
  to,
  message,
}: SendSmsParams) {
  if (!INFOBIP_API_KEY) {
    throw new Error(
      "Infobip API key is not configured."
    );
  }

  const recipients = Array.isArray(to)
    ? to
    : [to];

  const response = await axios.post(
    `${INFOBIP_BASE_URL}/sms/3/messages`,
    {
      messages: [
        {
          sender: INFOBIP_SENDER,

          destinations:
            recipients.map(
              (phoneNumber) => ({
                to: phoneNumber,
              })
            ),

          content: {
            text: message,
          },
        },
      ],
    },
    {
      headers: {
        Authorization:
          `App ${INFOBIP_API_KEY}`,

        "Content-Type":
          "application/json",

        Accept:
          "application/json",
      },
    }
  );
console.log(
  "INFOBIP SMS RESPONSE:",
  JSON.stringify(response.data, null, 2)
);
  return response.data;
}