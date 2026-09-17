import { apiRequest } from "./api";

import type {
  Customer,
  CustomerDetail,
  CustomersResponse,
  CustomerResponse,
  CustomerRole,
} from "@/types/customer";

/*
|--------------------------------------------------------------------------
| Admin — Get all customers
|--------------------------------------------------------------------------
*/

export async function getCustomers(): Promise<
  Customer[]
> {
  const response =
    await apiRequest<CustomersResponse>(
      "/users/customers"
    );

  return response.customers;
}

/*
|--------------------------------------------------------------------------
| Admin — Get single customer
|--------------------------------------------------------------------------
*/

export async function getCustomer(
  id: string
): Promise<CustomerDetail> {
  const response =
    await apiRequest<CustomerResponse>(
      `/users/customers/${id}`
    );

  return response.customer;
}

/*
|--------------------------------------------------------------------------
| Admin — Change customer role
|--------------------------------------------------------------------------
*/

export async function updateCustomerRole(
  id: string,
  role: CustomerRole
): Promise<CustomerDetail> {
  const response =
    await apiRequest<CustomerResponse>(
      `/users/customers/${id}/role`,
      {
        method: "PATCH",
        body: JSON.stringify({
          role,
        }),
      }
    );

  return response.customer;
}

/*
|--------------------------------------------------------------------------
| Admin — Delete customer
|--------------------------------------------------------------------------
*/

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