export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type BookingType =
  | "INSTANT"
  | "QUOTE_REQUEST";

export type QuoteStatus =
  | "PENDING"
  | "SENT"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED";

export type PaymentMethod =
  | "MPESA"
  | "CARD"
  | "CASH";

export type PaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED";

export interface BookingService {
  id: string;
  name: string;
  description: string | null;
  category:
    | "CLEANING"
    | "MOVING"
    | "ELECTRICAL";
  pricingType:
    | "FIXED"
    | "CALCULATED"
    | "QUOTE";
  basePrice: string | null;
  duration: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookingAddress {
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

export interface CleaningRequest {
  id: string;
  bookingId: string;
  propertyType: string;
  bedrooms: number | null;
  bathrooms: number | null;
  squareMeters: string | null;
  cleaningType: string;
  additionalRequirements: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MovingRequest {
  id: string;
  bookingId: string;
  pickupAddress: string;
  destinationAddress: string;
  propertyType: string;
  truckSize: string | null;
  numberOfMovers: number | null;
  packingRequired: boolean;
  specialItems: string | null;
  estimatedDistanceKm: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ElectricalRequest {
  id: string;
  bookingId: string;
  propertyType: string;
  numberOfFloors: number | null;
  bedrooms: number | null;
  newInstallation: boolean;
  rewiring: boolean;
  numberOfSockets: number | null;
  numberOfLights: number | null;
  distributionBoard: boolean;
  additionalRequirements: string | null;
  createdAt: string;
  updatedAt: string;
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
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StaffAssignment {
  id: string;
  bookingId: string;
  staffId: string;
  assignedAt: string;
  staff: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    };
    staffType:
      | "CLEANER"
      | "MOVER"
      | "ELECTRICIAN"
      | "SUPERVISOR";
  };
}

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  userId: string;

  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };

  serviceId: string;
  addressId: string;
  status: BookingStatus;
  bookingType: BookingType;
  scheduledDate: string;
  scheduledTime: string;
  totalAmount: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;

  service: BookingService;
  address: BookingAddress;

  cleaningRequest: CleaningRequest | null;
  movingRequest: MovingRequest | null;
  electricalRequest: ElectricalRequest | null;

  quote: Quote | null;
  payment: Payment | null;
  staffAssignments: StaffAssignment[];
  review: Review | null;
}