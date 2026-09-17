import type { BookingService } from "./booking";

export type QuoteStatus =
  | "PENDING"
  | "SENT"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED";

export interface QuoteBooking {
  id: string;
  bookingNumber: string;
  status: string;
  bookingType: string;
  scheduledDate: string;
  scheduledTime: string;

  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };

  service: BookingService;

  address?: {
    id: string;
    label: string;
    addressLine: string;
    city: string;
    county: string;
  };

  cleaningRequest?: {
    propertyType: string;
    bedrooms: number | null;
    bathrooms: number | null;
    squareMeters: string | null;
    cleaningType: string;
    additionalRequirements: string | null;
  };

  movingRequest?: {
    pickupAddress: string;
    destinationAddress: string;
    propertyType: string;
    truckSize: string | null;
    numberOfMovers: number | null;
    packingRequired: boolean;
    specialItems: string | null;
    estimatedDistanceKm: string | null;
  };

  electricalRequest?: {
    propertyType: string;
    numberOfFloors: number | null;
    bedrooms: number | null;
    newInstallation: boolean;
    rewiring: boolean;
    numberOfSockets: number | null;
    numberOfLights: number | null;
    distributionBoard: boolean;
    additionalRequirements: string | null;
  };
}

export interface Quote {
  id: string;
  bookingId: string;
  status: QuoteStatus;
  estimatedAmount: string | null;
  finalAmount: string | null;
  description: string | null;
  validUntil: string | null;
  createdAt: string;
  updatedAt: string;
  booking: QuoteBooking;
}

export interface QuotesResponse {
  success: boolean;
  quotes: Quote[];
}

export interface QuoteResponse {
  success: boolean;
  message: string;
  quote: Quote;
}