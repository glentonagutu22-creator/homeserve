import { apiRequest } from "./api";
import type {
  Payment,
  PaymentStatus,
} from "@/types/payment";

interface GetPaymentsResponse {
  success: boolean;
  payments: Payment[];
}

interface GetPaymentResponse {
  success: boolean;
  payment: Payment;
}

interface UpdatePaymentResponse {
  success: boolean;
  message: string;
  payment: Payment;
}

export async function getPayments(): Promise<Payment[]> {
  const response =
    await apiRequest<GetPaymentsResponse>(
      "/payments"
    );

  return response.payments;
}

export async function getPayment(
  paymentId: string
): Promise<Payment> {
  const response =
    await apiRequest<GetPaymentResponse>(
      `/payments/${paymentId}`
    );

  return response.payment;
}

export async function updatePaymentStatus(
  paymentId: string,
  status: PaymentStatus
): Promise<Payment> {
  const response =
    await apiRequest<UpdatePaymentResponse>(
      `/payments/${paymentId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    );

  return response.payment;
}