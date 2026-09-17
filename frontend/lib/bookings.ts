import { apiRequest } from "./api";
import type { Booking } from "@/types/booking";

interface BookingsResponse {
  success: boolean;
  bookings: Booking[];
}

interface BookingResponse {
  success: boolean;
  message?: string;
  booking: Booking;
}

interface CancelBookingData {
  reason?: string;
}

export async function getBookings(): Promise<Booking[]> {
  const response =
    await apiRequest<BookingsResponse>(
      "/bookings"
    );

  return response.bookings;
}

export async function getBooking(
  id: string
): Promise<Booking> {
  const response =
    await apiRequest<BookingResponse>(
      `/bookings/${id}`
    );

  return response.booking;
}

export async function cancelBooking(
  id: string,
  data?: CancelBookingData
): Promise<Booking> {
  const response =
    await apiRequest<BookingResponse>(
      `/bookings/${id}/cancel`,
      {
        method: "PATCH",
        body: JSON.stringify(data ?? {}),
      }
    );

  return response.booking;
}
export interface CreateCleaningBookingData {
  serviceId: string;
  addressId: string;
  bookingType: "INSTANT" | "QUOTE_REQUEST";
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
  cleaningRequest: {
    propertyType: string;
    bedrooms?: number;
    bathrooms?: number;
    squareMeters?: number;
    cleaningType: string;
    additionalRequirements?: string;
  };
}

export interface CreateMovingBookingData {
  serviceId: string;
  addressId: string;
  bookingType: "INSTANT" | "QUOTE_REQUEST";
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
  movingRequest: {
    pickupAddress: string;
    destinationAddress: string;
    propertyType: string;
    truckSize?: string;
    numberOfMovers?: number;
    packingRequired: boolean;
    specialItems?: string;
    estimatedDistanceKm?: number;
  };
}

export interface CreateElectricalBookingData {
  serviceId: string;
  addressId: string;
  bookingType: "INSTANT" | "QUOTE_REQUEST";
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
  electricalRequest: {
    propertyType: string;
    numberOfFloors?: number;
    bedrooms?: number;
    newInstallation: boolean;
    rewiring: boolean;
    numberOfSockets?: number;
    numberOfLights?: number;
    distributionBoard: boolean;
    additionalRequirements?: string;
  };
}

export type CreateBookingData =
  | CreateCleaningBookingData
  | CreateMovingBookingData
  | CreateElectricalBookingData;

  export async function createBooking(
  data: CreateBookingData
): Promise<Booking> {
  const response =
    await apiRequest<BookingResponse>(
      "/bookings",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

  return response.booking;
}
/*
|--------------------------------------------------------------------------
| Admin — Get All Bookings
|--------------------------------------------------------------------------
*/

export async function getAdminBookings(): Promise<Booking[]> {
  const response = await apiRequest<BookingsResponse>(
    "/bookings/admin"
  );

  return response.bookings;
}

/*
|--------------------------------------------------------------------------
| Admin — Get Single Booking
|--------------------------------------------------------------------------
*/

export async function getAdminBooking(
  id: string
): Promise<Booking> {
  const response =
    await apiRequest<BookingResponse>(
      `/bookings/admin/${id}`
    );

  return response.booking;
}