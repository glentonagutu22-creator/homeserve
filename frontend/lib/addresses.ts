import { apiRequest } from "./api";

export interface Address {
  id: string;
  userId: string;
  label: string;
  addressLine: string;
  city: string;
  county: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressData {
  label: string;
  addressLine: string;
  city: string;
  county: string;
  latitude?: number;
  longitude?: number;
}

export type UpdateAddressData =
  Partial<CreateAddressData>;

interface AddressResponse {
  success: boolean;
  message: string;
  address: Address;
}

interface AddressesResponse {
  success: boolean;
  addresses: Address[];
}

export async function getAddresses(): Promise<Address[]> {
  const response =
    await apiRequest<AddressesResponse>("/addresses");

  return response.addresses;
}

export async function getAddress(
  id: string
): Promise<Address> {
  const response =
    await apiRequest<AddressResponse>(
      `/addresses/${id}`
    );

  return response.address;
}

export async function createAddress(
  data: CreateAddressData
): Promise<Address> {
  const response =
    await apiRequest<AddressResponse>(
      "/addresses",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

  return response.address;
}

export async function updateAddress(
  id: string,
  data: UpdateAddressData
): Promise<Address> {
  const response =
    await apiRequest<AddressResponse>(
      `/addresses/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );

  return response.address;
}

export async function deleteAddress(
  id: string
): Promise<void> {
  await apiRequest(
    `/addresses/${id}`,
    {
      method: "DELETE",
    }
  );
}