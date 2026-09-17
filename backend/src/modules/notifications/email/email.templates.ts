type EmailTemplate = {
  subject: string;
  html: string;
  text: string;
};

const BRAND = "#061F35";
const BLUE = "#2563EB";
const LIGHT_BG = "#F8FAFC";
const BORDER = "#E2E8F0";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function layout(
  content: string
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>HomeServe</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:${LIGHT_BG};
    font-family:Arial,Helvetica,sans-serif;
    color:#334155;
  "
>
  <div
    style="
      width:100%;
      padding:40px 16px;
      box-sizing:border-box;
    "
  >
    <div
      style="
        max-width:600px;
        margin:0 auto;
        background:#ffffff;
        border:1px solid ${BORDER};
        border-radius:12px;
        overflow:hidden;
      "
    >

      <!-- Header -->

      <div
        style="
          background:${BRAND};
          padding:24px 28px;
        "
      >
        <div
          style="
            font-size:24px;
            font-weight:700;
            color:#ffffff;
          "
        >
          HomeServe
        </div>

        <div
          style="
            margin-top:5px;
            font-size:13px;
            color:#CBD5E1;
          "
        >
          Professional services at your doorstep
        </div>
      </div>

      <!-- Content -->

      <div
        style="
          padding:32px 28px;
        "
      >
        ${content}
      </div>

      <!-- Footer -->

      <div
        style="
          border-top:1px solid ${BORDER};
          padding:20px 28px;
          background:#F8FAFC;
        "
      >
        <p
          style="
            margin:0;
            font-size:12px;
            line-height:18px;
            color:#64748B;
          "
        >
          This email was sent by HomeServe.
          Please do not reply to this automated message.
        </p>

        <p
          style="
            margin:8px 0 0;
            font-size:12px;
            color:#94A3B8;
          "
        >
          &copy; ${new Date().getFullYear()} HomeServe
        </p>
      </div>

    </div>
  </div>
</body>
</html>
`;
}

function detailsTable(
  rows: Array<[string, string]>
) {
  return `
    <div
      style="
        margin:24px 0;
        border:1px solid ${BORDER};
        border-radius:8px;
        overflow:hidden;
      "
    >
      ${rows
        .map(
          ([label, value]) => `
            <div
              style="
                display:flex;
                justify-content:space-between;
                gap:20px;
                padding:12px 16px;
                border-bottom:1px solid ${BORDER};
              "
            >
              <span
                style="
                  font-size:13px;
                  color:#64748B;
                "
              >
                ${escapeHtml(label)}
              </span>

              <span
                style="
                  font-size:13px;
                  font-weight:600;
                  color:${BRAND};
                  text-align:right;
                "
              >
                ${escapeHtml(value)}
              </span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

/*
|--------------------------------------------------------------------------
| Welcome
|--------------------------------------------------------------------------
*/

export function welcomeEmail(
  name: string
): EmailTemplate {
  const safeName = escapeHtml(name);

  return {
    subject: "Welcome to HomeServe",

    html: layout(`
      <h1
        style="
          margin:0;
          font-size:24px;
          color:${BRAND};
        "
      >
        Welcome to HomeServe, ${safeName}!
      </h1>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        Your HomeServe account has been created successfully.
      </p>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        You can now book professional cleaning, moving,
        and electrical services directly through HomeServe.
      </p>

      <p
        style="
          margin:24px 0 0;
          font-size:15px;
          font-weight:600;
          color:${BRAND};
        "
      >
        Welcome aboard!
      </p>
    `),

    text: `
Welcome to HomeServe, ${name}!

Your HomeServe account has been created successfully.

You can now book professional cleaning, moving, and electrical services through HomeServe.

Welcome aboard!

HomeServe
Professional services at your doorstep
`.trim(),
  };
}

/*
|--------------------------------------------------------------------------
| Booking Created
|--------------------------------------------------------------------------
*/

export function bookingCreatedEmail(data: {
  name: string;
  bookingNumber: string;
  serviceName: string;
  scheduledDate: string;
  scheduledTime: string;
  totalAmount?: string;
}): EmailTemplate {
  const {
    name,
    bookingNumber,
    serviceName,
    scheduledDate,
    scheduledTime,
    totalAmount,
  } = data;

  return {
    subject: `Booking received - ${bookingNumber}`,

    html: layout(`
      <h1
        style="
          margin:0;
          font-size:24px;
          color:${BRAND};
        "
      >
        Booking Received
      </h1>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        Hello ${escapeHtml(name)},
      </p>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        We have received your HomeServe booking request.
      </p>

      ${detailsTable([
        ["Booking", bookingNumber],
        ["Service", serviceName],
        ["Date", scheduledDate],
        ["Time", scheduledTime],
        ...(totalAmount
          ? [["Amount", totalAmount] as [string, string]]
          : []),
      ])}

      <p
        style="
          margin:0;
          font-size:14px;
          line-height:22px;
          color:#64748B;
        "
      >
        We will keep you updated as your booking progresses.
      </p>
    `),

    text: `
Booking Received

Hello ${name},

We have received your HomeServe booking request.

Booking: ${bookingNumber}
Service: ${serviceName}
Date: ${scheduledDate}
Time: ${scheduledTime}
${totalAmount ? `Amount: ${totalAmount}` : ""}

We will keep you updated as your booking progresses.

HomeServe
Professional services at your doorstep
`.trim(),
  };
}

/*
|--------------------------------------------------------------------------
| Booking Confirmed
|--------------------------------------------------------------------------
*/

export function bookingConfirmedEmail(data: {
  name: string;
  bookingNumber: string;
  serviceName: string;
  scheduledDate: string;
  scheduledTime: string;
  totalAmount?: string;
}): EmailTemplate {
  const {
    name,
    bookingNumber,
    serviceName,
    scheduledDate,
    scheduledTime,
    totalAmount,
  } = data;

  return {
    subject: `Booking confirmed - ${bookingNumber}`,

    html: layout(`
      <h1
        style="
          margin:0;
          font-size:24px;
          color:${BRAND};
        "
      >
        Booking Confirmed
      </h1>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        Hello ${escapeHtml(name)},
      </p>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        Your HomeServe booking has been confirmed.
      </p>

      ${detailsTable([
        ["Booking", bookingNumber],
        ["Service", serviceName],
        ["Date", scheduledDate],
        ["Time", scheduledTime],
        ...(totalAmount
          ? [["Amount", totalAmount] as [string, string]]
          : []),
      ])}

      <p
        style="
          margin:0;
          font-size:14px;
          line-height:22px;
          color:#64748B;
        "
      >
        Thank you for choosing HomeServe.
      </p>
    `),

    text: `
Booking Confirmed

Hello ${name},

Your HomeServe booking has been confirmed.

Booking: ${bookingNumber}
Service: ${serviceName}
Date: ${scheduledDate}
Time: ${scheduledTime}
${totalAmount ? `Amount: ${totalAmount}` : ""}

Thank you for choosing HomeServe.

HomeServe
Professional services at your doorstep
`.trim(),
  };
}

/*
|--------------------------------------------------------------------------
| Booking Cancelled
|--------------------------------------------------------------------------
*/

export function bookingCancelledEmail(data: {
  name: string;
  bookingNumber: string;
  serviceName: string;
  reason?: string;
}): EmailTemplate {
  const {
    name,
    bookingNumber,
    serviceName,
    reason,
  } = data;

  return {
    subject: `Booking cancelled - ${bookingNumber}`,

    html: layout(`
      <h1
        style="
          margin:0;
          font-size:24px;
          color:${BRAND};
        "
      >
        Booking Cancelled
      </h1>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        Hello ${escapeHtml(name)},
      </p>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        Your HomeServe booking has been cancelled.
      </p>

      ${detailsTable([
        ["Booking", bookingNumber],
        ["Service", serviceName],
        ...(reason
          ? [["Reason", reason] as [string, string]]
          : []),
      ])}

      <p
        style="
          margin:0;
          font-size:14px;
          line-height:22px;
          color:#64748B;
        "
      >
        If you need another service, you can create a new
        booking through HomeServe.
      </p>
    `),

    text: `
Booking Cancelled

Hello ${name},

Your HomeServe booking has been cancelled.

Booking: ${bookingNumber}
Service: ${serviceName}
${reason ? `Reason: ${reason}` : ""}

If you need another service, you can create a new booking through HomeServe.

HomeServe
Professional services at your doorstep
`.trim(),
  };
}

/*
|--------------------------------------------------------------------------
| Staff Assigned
|--------------------------------------------------------------------------
*/

export function staffAssignedEmail(data: {
  name: string;
  bookingNumber: string;
  serviceName: string;
  staffName: string;
  scheduledDate: string;
  scheduledTime: string;
}): EmailTemplate {
  const {
    name,
    bookingNumber,
    serviceName,
    staffName,
    scheduledDate,
    scheduledTime,
  } = data;

  return {
    subject: `Professional assigned - ${bookingNumber}`,

    html: layout(`
      <h1
        style="
          margin:0;
          font-size:24px;
          color:${BRAND};
        "
      >
        Professional Assigned
      </h1>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        Hello ${escapeHtml(name)},
      </p>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        A HomeServe professional has been assigned to your booking.
      </p>

      ${detailsTable([
        ["Booking", bookingNumber],
        ["Service", serviceName],
        ["Professional", staffName],
        ["Date", scheduledDate],
        ["Time", scheduledTime],
      ])}
    `),

    text: `
Professional Assigned

Hello ${name},

A HomeServe professional has been assigned to your booking.

Booking: ${bookingNumber}
Service: ${serviceName}
Professional: ${staffName}
Date: ${scheduledDate}
Time: ${scheduledTime}

HomeServe
Professional services at your doorstep
`.trim(),
  };
}

/*
|--------------------------------------------------------------------------
| Job Completed
|--------------------------------------------------------------------------
*/

export function jobCompletedEmail(data: {
  name: string;
  bookingNumber: string;
  serviceName: string;
}): EmailTemplate {
  const {
    name,
    bookingNumber,
    serviceName,
  } = data;

  return {
    subject: `Service completed - ${bookingNumber}`,

    html: layout(`
      <h1
        style="
          margin:0;
          font-size:24px;
          color:${BRAND};
        "
      >
        Service Completed
      </h1>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        Hello ${escapeHtml(name)},
      </p>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        Your HomeServe service has been completed successfully.
      </p>

      ${detailsTable([
        ["Booking", bookingNumber],
        ["Service", serviceName],
      ])}

      <p
        style="
          margin:0;
          font-size:14px;
          line-height:22px;
          color:#64748B;
        "
      >
        Thank you for choosing HomeServe. We appreciate your business.
      </p>
    `),

    text: `
Service Completed

Hello ${name},

Your HomeServe service has been completed successfully.

Booking: ${bookingNumber}
Service: ${serviceName}

Thank you for choosing HomeServe.

HomeServe
Professional services at your doorstep
`.trim(),
  };
}

/*
|--------------------------------------------------------------------------
| Quote Sent
|--------------------------------------------------------------------------
*/

export function quoteSentEmail(data: {
  name: string;
  bookingNumber: string;
  serviceName: string;
  amount: string;
  validUntil?: string;
  description?: string;
}): EmailTemplate {
  const {
    name,
    bookingNumber,
    serviceName,
    amount,
    validUntil,
    description,
  } = data;

  return {
    subject: `Your HomeServe quote - ${bookingNumber}`,

    html: layout(`
      <h1
        style="
          margin:0;
          font-size:24px;
          color:${BRAND};
        "
      >
        Your Quote Is Ready
      </h1>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        Hello ${escapeHtml(name)},
      </p>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        Your HomeServe quote is now available for review.
      </p>

      ${detailsTable([
        ["Booking", bookingNumber],
        ["Service", serviceName],
        ["Quoted Amount", amount],
        ...(validUntil
          ? [["Valid Until", validUntil] as [string, string]]
          : []),
      ])}

      ${
        description
          ? `
            <div
              style="
                margin:24px 0;
                padding:16px;
                background:#F8FAFC;
                border-left:4px solid ${BLUE};
              "
            >
              <p
                style="
                  margin:0 0 8px;
                  font-size:13px;
                  font-weight:600;
                  color:${BRAND};
                "
              >
                Quote Details
              </p>

              <p
                style="
                  margin:0;
                  font-size:14px;
                  line-height:22px;
                  color:#64748B;
                "
              >
                ${escapeHtml(description)}
              </p>
            </div>
          `
          : ""
      }

      <p
        style="
          margin:0;
          font-size:14px;
          line-height:22px;
          color:#64748B;
        "
      >
        Please log in to your HomeServe account to review the quote
        and accept or reject it.
      </p>
    `),

    text: `
Your Quote Is Ready

Hello ${name},

Your HomeServe quote is now available for review.

Booking: ${bookingNumber}
Service: ${serviceName}
Quoted Amount: ${amount}
${validUntil ? `Valid Until: ${validUntil}` : ""}

${description ? `Quote Details:\n${description}` : ""}

Please log in to your HomeServe account to review the quote and accept or reject it.

HomeServe
Professional services at your doorstep
`.trim(),
  };
}

/*
|--------------------------------------------------------------------------
| Quote Accepted
|--------------------------------------------------------------------------
*/

export function quoteAcceptedEmail(data: {
  name: string;
  bookingNumber: string;
  serviceName: string;
  amount: string;
}): EmailTemplate {
  const {
    name,
    bookingNumber,
    serviceName,
    amount,
  } = data;

  return {
    subject: `Quote accepted - ${bookingNumber}`,

    html: layout(`
      <h1
        style="
          margin:0;
          font-size:24px;
          color:${BRAND};
        "
      >
        Quote Accepted
      </h1>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        Hello ${escapeHtml(name)},
      </p>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        Your quote has been accepted successfully.
      </p>

      ${detailsTable([
        ["Booking", bookingNumber],
        ["Service", serviceName],
        ["Amount", amount],
      ])}

      <p
        style="
          margin:0;
          font-size:14px;
          line-height:22px;
          color:#64748B;
        "
      >
        HomeServe will continue processing your booking.
      </p>
    `),

    text: `
Quote Accepted

Hello ${name},

Your quote has been accepted successfully.

Booking: ${bookingNumber}
Service: ${serviceName}
Amount: ${amount}

HomeServe will continue processing your booking.

HomeServe
Professional services at your doorstep
`.trim(),
  };
}

/*
|--------------------------------------------------------------------------
| Quote Rejected
|--------------------------------------------------------------------------
*/

export function quoteRejectedEmail(data: {
  name: string;
  bookingNumber: string;
  serviceName: string;
}): EmailTemplate {
  const {
    name,
    bookingNumber,
    serviceName,
  } = data;

  return {
    subject: `Quote declined - ${bookingNumber}`,

    html: layout(`
      <h1
        style="
          margin:0;
          font-size:24px;
          color:${BRAND};
        "
      >
        Quote Declined
      </h1>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        Hello ${escapeHtml(name)},
      </p>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        The quote associated with your HomeServe booking
        has been declined.
      </p>

      ${detailsTable([
        ["Booking", bookingNumber],
        ["Service", serviceName],
      ])}

      <p
        style="
          margin:0;
          font-size:14px;
          line-height:22px;
          color:#64748B;
        "
      >
        If you have questions about the quote, please contact
        the HomeServe team.
      </p>
    `),

    text: `
Quote Declined

Hello ${name},

The quote associated with your HomeServe booking has been declined.

Booking: ${bookingNumber}
Service: ${serviceName}

If you have questions about the quote, please contact the HomeServe team.

HomeServe
Professional services at your doorstep
`.trim(),
  };
}

/*
|--------------------------------------------------------------------------
| Quote Expired
|--------------------------------------------------------------------------
*/

export function quoteExpiredEmail(data: {
  name: string;
  bookingNumber: string;
  serviceName: string;
}): EmailTemplate {
  const {
    name,
    bookingNumber,
    serviceName,
  } = data;

  return {
    subject: `Quote expired - ${bookingNumber}`,

    html: layout(`
      <h1
        style="
          margin:0;
          font-size:24px;
          color:${BRAND};
        "
      >
        Quote Expired
      </h1>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        Hello ${escapeHtml(name)},
      </p>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        Your HomeServe quote has expired.
      </p>

      ${detailsTable([
        ["Booking", bookingNumber],
        ["Service", serviceName],
      ])}

      <p
        style="
          margin:0;
          font-size:14px;
          line-height:22px;
          color:#64748B;
        "
      >
        Please contact HomeServe if you would like to request
        a new quote.
      </p>
    `),

    text: `
Quote Expired

Hello ${name},

Your HomeServe quote has expired.

Booking: ${bookingNumber}
Service: ${serviceName}

Please contact HomeServe if you would like to request a new quote.

HomeServe
Professional services at your doorstep
`.trim(),
  };
}

/*
|--------------------------------------------------------------------------
| Payment Completed
|--------------------------------------------------------------------------
*/

export function paymentCompletedEmail(data: {
  name: string;
  bookingNumber: string;
  amount: string;
  paymentMethod: string;
  transactionReference?: string;
}): EmailTemplate {
  const {
    name,
    bookingNumber,
    amount,
    paymentMethod,
    transactionReference,
  } = data;

  return {
    subject: `Payment received - ${bookingNumber}`,

    html: layout(`
      <h1
        style="
          margin:0;
          font-size:24px;
          color:${BRAND};
        "
      >
        Payment Received
      </h1>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        Hello ${escapeHtml(name)},
      </p>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        We have successfully received your payment.
      </p>

      ${detailsTable([
        ["Booking", bookingNumber],
        ["Amount", amount],
        ["Payment Method", paymentMethod],
        ...(transactionReference
          ? [
              [
                "Transaction",
                transactionReference,
              ] as [string, string],
            ]
          : []),
      ])}

      <p
        style="
          margin:0;
          font-size:14px;
          line-height:22px;
          color:#64748B;
        "
      >
        Thank you for choosing HomeServe.
      </p>
    `),

    text: `
Payment Received

Hello ${name},

We have successfully received your payment.

Booking: ${bookingNumber}
Amount: ${amount}
Payment Method: ${paymentMethod}
${
  transactionReference
    ? `Transaction: ${transactionReference}`
    : ""
}

Thank you for choosing HomeServe.

HomeServe
Professional services at your doorstep
`.trim(),
  };
}

/*
|--------------------------------------------------------------------------
| Payment Failed
|--------------------------------------------------------------------------
*/

export function paymentFailedEmail(data: {
  name: string;
  bookingNumber: string;
  amount: string;
  paymentMethod: string;
}): EmailTemplate {
  const {
    name,
    bookingNumber,
    amount,
    paymentMethod,
  } = data;

  return {
    subject: `Payment failed - ${bookingNumber}`,

    html: layout(`
      <h1
        style="
          margin:0;
          font-size:24px;
          color:${BRAND};
        "
      >
        Payment Failed
      </h1>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        Hello ${escapeHtml(name)},
      </p>

      <p
        style="
          margin:16px 0;
          font-size:15px;
          line-height:24px;
        "
      >
        Unfortunately, your HomeServe payment could not
        be completed.
      </p>

      ${detailsTable([
        ["Booking", bookingNumber],
        ["Amount", amount],
        ["Payment Method", paymentMethod],
      ])}

      <p
        style="
          margin:0;
          font-size:14px;
          line-height:22px;
          color:#64748B;
        "
      >
        Please try again or use another payment method.
      </p>
    `),

    text: `
Payment Failed

Hello ${name},

Unfortunately, your HomeServe payment could not be completed.

Booking: ${bookingNumber}
Amount: ${amount}
Payment Method: ${paymentMethod}

Please try again or use another payment method.

HomeServe
Professional services at your doorstep
`.trim(),
  };
}