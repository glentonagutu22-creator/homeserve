import { apiRequest } from "./api";

import type {
  Customer,
  CustomerDetail,
  CustomersResponse,
  CustomerResponse,
  CustomerRole,
} from "@/types/customer";

export async function getCustomers(): Promise<Customer[]> {
  const response =
    await apiRequest<CustomersResponse>(
      "/users/customers"
    );

  return response.customers;
}

export async function getCustomer(
  id: string
): Promise<CustomerDetail> {
  const response =
    await apiRequest<CustomerResponse>(
      `/users/customers/${id}`
    );

  return response.customer;
}

export async function updateCustomerRole(
  id: string,
  role: CustomerRole
): Promise<Customer> {
  const response = await apiRequest<{
    success: boolean;
    message: string;
    user: Customer;
  }>(
    `/users/customers/${id}/role`,
    {
      method: "PATCH",
      body: JSON.stringify({
        role,
      }),
    }
  );

  return response.user;
}

export async function deleteCustomer(
  id: string
): Promise<void> {
  await apiRequest(
    `/users/customers/${id}`,
    {
      method: "DELETE",
    }
  );
}