import { apiRequest } from "@/lib/api";

export interface ReportsData {
  bookings: {
    total: number;
    byStatus: {
      PENDING: number;
      CONFIRMED: number;
      ASSIGNED: number;
      IN_PROGRESS: number;
      COMPLETED: number;
      CANCELLED: number;
    };
  };

  users: {
    customers: number;
    staff: number;
  };

  services: {
    active: number;
  };

  revenue: {
    completed: number;
    refunded: number;
    net: number;
  };

  payments: {
    completed: number;
    pending: number;
    failed: number;
    refunded: number;
    byMethod: {
      MPESA: {
        count: number;
        amount: number;
      };
      CARD: {
        count: number;
        amount: number;
      };
      CASH: {
        count: number;
        amount: number;
      };
    };
  };

  quotes: {
    PENDING: number;
    SENT: number;
    ACCEPTED: number;
    REJECTED: number;
    EXPIRED: number;
  };

  bookingsByCategory: {
    CLEANING: number;
    MOVING: number;
    ELECTRICAL: number;
  };

  bookingsByService: Array<{
    id: string;
    name: string;
    category:
      | "CLEANING"
      | "MOVING"
      | "ELECTRICAL";
    bookings: number;
  }>;

  recentBookings: Array<{
    id: string;
    bookingNumber: string;
    status:
      | "PENDING"
      | "CONFIRMED"
      | "ASSIGNED"
      | "IN_PROGRESS"
      | "COMPLETED"
      | "CANCELLED";
    bookingType:
      | "INSTANT"
      | "QUOTE_REQUEST";
    totalAmount: number | null;
    scheduledDate: string;
    createdAt: string;

    user: {
      name: string;
      email: string;
    };

    service: {
      name: string;
      category:
        | "CLEANING"
        | "MOVING"
        | "ELECTRICAL";
    };

    payment: {
      amount: number;
      status:
        | "PENDING"
        | "COMPLETED"
        | "FAILED"
        | "REFUNDED";
      method:
        | "MPESA"
        | "CARD"
        | "CASH";
      paidAt: string | null;
    } | null;
  }>;
}

interface ReportsResponse {
  success: boolean;
  reports: ReportsData;
}

export async function getReports(): Promise<ReportsData> {
  const response =
    await apiRequest<ReportsResponse>(
      "/reports"
    );

  return response.reports;
}