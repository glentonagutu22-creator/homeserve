import { apiRequest } from "./api";

import type {
  Staff,
  StaffAssignment,
  StaffListResponse,
  StaffResponse,
  CreateStaffData,
  UpdateStaffData,
  AssignmentsResponse,
  AssignmentResponse,
  BookingStaffResponse,

} from "@/types/staff";

export async function createStaff(
  data: CreateStaffData
): Promise<Staff> {
  const response =
    await apiRequest<StaffResponse>(
      "/staff",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

  return response.staff;
}

export async function getStaff(): Promise<Staff[]> {
  const response =
    await apiRequest<StaffListResponse>(
      "/staff"
    );

  return response.staff;
}

export async function getStaffMember(
  id: string
): Promise<Staff> {
  const response =
    await apiRequest<StaffResponse>(
      `/staff/${id}`
    );

  return response.staff;
}

export async function updateStaffMember(
  id: string,
  data: UpdateStaffData
): Promise<Staff> {
  const response =
    await apiRequest<StaffResponse>(
      `/staff/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );

  return response.staff;
}

export async function updateStaffAvailability(
  id: string,
  isAvailable: boolean
): Promise<Staff> {
  const response =
    await apiRequest<StaffResponse>(
      `/staff/${id}/availability`,
      {
        method: "PATCH",
        body: JSON.stringify({
          isAvailable,
        }),
      }
    );

  return response.staff;
}

export async function assignStaff(
  staffId: string,
  bookingId: string
): Promise<StaffAssignment> {
  const response =
    await apiRequest<AssignmentResponse>(
      `/staff/${staffId}/assign`,
      {
        method: "POST",
        body: JSON.stringify({
          bookingId,
        }),
      }
    );

  return response.assignment;
}

export async function getStaffAssignments(
  staffId: string
): Promise<StaffAssignment[]> {
  const response =
    await apiRequest<AssignmentsResponse>(
      `/staff/${staffId}/assignments`
    );

  return response.assignments;
}

export async function getBookingStaff(
  bookingId: string
): Promise<StaffAssignment[]> {
  const response =
    await apiRequest<BookingStaffResponse>(
      `/staff/booking/${bookingId}`
    );

  return response.assignments;
}

export async function unassignStaff(
  assignmentId: string
): Promise<void> {
  await apiRequest(
    `/staff/assignments/${assignmentId}`,
    {
      method: "DELETE",
    }
  );
}

export async function getMyStaffProfile(): Promise<Staff> {
  const response =
    await apiRequest<StaffResponse>(
      "/staff/me"
    );

  return response.staff;
}

export async function getMyAssignments(): Promise<
  StaffAssignment[]
> {
  const response =
    await apiRequest<AssignmentsResponse>(
      "/staff/me/assignments"
    );

  return response.assignments;
}

export async function updateMyAvailability(
  isAvailable: boolean
): Promise<Staff> {
  const response =
    await apiRequest<StaffResponse>(
      "/staff/me/availability",
      {
        method: "PATCH",
        body: JSON.stringify({
          isAvailable,
        }),
      }
    );

  return response.staff;
}

export async function updateMyBookingStatus(
  bookingId: string,
  status: "IN_PROGRESS" | "COMPLETED"
) {
  const response =
    await apiRequest<{
      success: boolean;
      message: string;
      booking: {
        id: string;
        status: string;
      };
    }>(
      `/staff/me/bookings/${bookingId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status,
        }),
      }
    );

  return response.booking;
}