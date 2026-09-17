/*
|--------------------------------------------------------------------------
| Booking
|--------------------------------------------------------------------------
*/

export function bookingCreatedSms(
  bookingNumber: string,
  serviceName: string,
  scheduledDate: string,
  scheduledTime: string
): string {
  return (
    `HomeServe: Booking ${bookingNumber} ` +
    `created for ${serviceName}. ` +
    `Scheduled for ${scheduledDate} at ${scheduledTime}.`
  );
}

export function bookingConfirmedSms(
  bookingNumber: string,
  serviceName: string
): string {
  return (
    `HomeServe: Booking ${bookingNumber} ` +
    `for ${serviceName} has been confirmed.`
  );
}

export function bookingCancelledSms(
  bookingNumber: string,
  serviceName: string
): string {
  return (
    `HomeServe: Booking ${bookingNumber} ` +
    `for ${serviceName} has been cancelled.`
  );
}

/*
|--------------------------------------------------------------------------
| Staff / Job
|--------------------------------------------------------------------------
*/

export function staffAssignedSms(
  bookingNumber: string,
  staffName: string
): string {
  return (
    `HomeServe: ${staffName} has been assigned ` +
    `to booking ${bookingNumber}.`
  );
}

export function jobStartedSms(
  bookingNumber: string,
  serviceName: string
): string {
  return (
    `HomeServe: Your ${serviceName} ` +
    `job ${bookingNumber} has started.`
  );
}

export function jobCompletedSms(
  bookingNumber: string,
  serviceName: string
): string {
  return (
    `HomeServe: Your ${serviceName} ` +
    `job ${bookingNumber} has been completed.`
  );
}

/*
|--------------------------------------------------------------------------
| Quotes
|--------------------------------------------------------------------------
*/

export function quoteSentSms(
  bookingNumber: string,
  amount: string
): string {
  return (
    `HomeServe: A quote of KES ${amount} ` +
    `has been sent for booking ${bookingNumber}. ` +
    `Please review it in your HomeServe account.`
  );
}

export function quoteAcceptedSms(
  bookingNumber: string
): string {
  return (
    `HomeServe: Your quote for booking ` +
    `${bookingNumber} has been accepted.`
  );
}

export function quoteRejectedSms(
  bookingNumber: string
): string {
  return (
    `HomeServe: Your quote for booking ` +
    `${bookingNumber} has been rejected.`
  );
}

export function quoteExpiredSms(
  bookingNumber: string
): string {
  return (
    `HomeServe: Your quote for booking ` +
    `${bookingNumber} has expired.`
  );
}

/*
|--------------------------------------------------------------------------
| Payments
|--------------------------------------------------------------------------
*/

export function paymentCompletedSms(
  bookingNumber: string,
  amount: string
): string {
  return (
    `HomeServe: Payment of KES ${amount} ` +
    `for booking ${bookingNumber} was successful.`
  );
}

export function paymentFailedSms(
  bookingNumber: string,
  amount: string
): string {
  return (
    `HomeServe: Payment of KES ${amount} ` +
    `for booking ${bookingNumber} failed. ` +
    `Please try again.`
  );
}