import type { BookingService } from "./booking";

export type StaffType =
  | "CLEANER"
  | "MOVER"
  | "ELECTRICIAN"
  | "SUPERVISOR";

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "STAFF" | "ADMIN" | "CUSTOMER";
  createdAt?: string;
  updatedAt?: string;
}

export interface Staff {
  id: string;
  userId: string;
  staffType: StaffType;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  user: StaffUser;
}

export interface StaffAssignment {
  id: string;
  bookingId: string;
  staffId: string;
  assignedAt: string;
  completedAt: string | null;

  staff?: Staff;

  booking: {
    id: string;
    bookingNumber: string;
    status: string;
    bookingType: string;
    scheduledDate: string;
    scheduledTime: string;
    totalAmount: string | null;
      notes: string | null;

    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
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
  };
}

export interface CreateStaffData {
  name: string;
  email: string;
  phone: string;
  password: string;
  staffType: StaffType;
}

export interface UpdateStaffData {
  name?: string;
  phone?: string;
  staffType?: StaffType;
}

export interface StaffResponse {
  success: boolean;
  message?: string;
  staff: Staff;
}

export interface StaffListResponse {
  success: boolean;
  staff: Staff[];
}

export interface AssignmentsResponse {
  success: boolean;
  assignments: StaffAssignment[];
}

export interface AssignmentResponse {
  success: boolean;
  message: string;
  assignment: StaffAssignment;
}

export interface BookingStaffResponse {
  success: boolean;
  assignments: StaffAssignment[];
}