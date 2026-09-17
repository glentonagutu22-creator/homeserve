export type CustomerRole =
  | "CUSTOMER"
  | "ADMIN";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: CustomerRole;
  createdAt: string;
  updatedAt: string;

  _count: {
    bookings: number;
  };
}

export interface CustomerAddress {
  id: string;
  label: string;
  addressLine: string;
  city: string;
  county: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDetail
  extends Customer {
  _count: {
    bookings: number;
    reviews: number;
    addresses: number;
  };

  bookings: Array<{
    id: string;
    bookingNumber: string;
    status: string;
    bookingType: string;
    scheduledDate: string;
    scheduledTime: string;
    totalAmount: string | null;
    notes: string | null;
    createdAt: string;
    service: {
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
    };
    address: CustomerAddress;
    quote: {
      id: string;
      status: string;
      estimatedAmount: string | null;
      finalAmount: string | null;
    } | null;
    payment: {
      id: string;
      amount: string;
      method: string;
      status: string;
      transactionReference: string | null;
      paidAt: string | null;
    } | null;
  }>;

  addresses: CustomerAddress[];
}

export interface CustomersResponse {
  success: boolean;
  customers: Customer[];
}

export interface CustomerResponse {
  success: boolean;
  customer: CustomerDetail;
}