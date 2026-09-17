export type PaymentMethod =
  | "MPESA"
  | "CARD"
  | "CASH";

export type PaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED";

export interface PaymentCustomer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface PaymentService {
  id: string;
  name: string;
  category:
    | "CLEANING"
    | "MOVING"
    | "ELECTRICAL";
  pricingType:
    | "FIXED"
    | "CALCULATED"
    | "QUOTE";
}

export interface PaymentAddress {
  id: string;
  label: string;
  addressLine: string;
  city: string;
  county: string;
}

export interface PaymentBooking {
  id: string;
  bookingNumber: string;
  status: string;
  scheduledDate: string;
  scheduledTime: string;
  user: PaymentCustomer;
  service: PaymentService;
  address: PaymentAddress;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: string | number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionReference: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  booking: PaymentBooking;
}