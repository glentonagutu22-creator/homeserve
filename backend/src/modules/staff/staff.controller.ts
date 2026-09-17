import { Request, Response } from "express";

import {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  updateStaffAvailability,
  assignStaffToBooking,
  unassignStaffFromBooking,
  getStaffAssignments,
  getBookingAssignments,
  getMyStaffProfile,
getMyStaffAssignments,
updateMyStaffAvailability,
updateAssignedBookingStatus,
} from "./staff.service";

export async function create(
  req: Request,
  res: Response
) {
  const staff = await createStaff(req.body);

  return res.status(201).json({
    success: true,
    message: "Staff member created successfully",
    staff,
  });
}

export async function getAll(
  _req: Request,
  res: Response
) {
  const staff = await getAllStaff();

  return res.status(200).json({
    success: true,
    staff,
  });
}

export async function getOne(
  req: Request,
  res: Response
) {
  const staff = await getStaffById(
    String(req.params.id)
  );

  return res.status(200).json({
    success: true,
    staff,
  });
}

export async function update(
  req: Request,
  res: Response
) {
  const staff = await updateStaff(
    String(req.params.id),
    req.body
  );

  return res.status(200).json({
    success: true,
    message: "Staff member updated successfully",
    staff,
  });
}

export async function updateAvailability(
  req: Request,
  res: Response
) {
  const staff =
    await updateStaffAvailability(
      String(req.params.id),
      req.body.isAvailable
    );

  return res.status(200).json({
    success: true,
    message: "Staff availability updated successfully",
    staff,
  });
}

/*
 * Assign a staff member to a booking
 */
export async function assign(
  req: Request,
  res: Response
) {
  const assignment =
    await assignStaffToBooking(
      String(req.params.id),
      req.body.bookingId
    );

  return res.status(201).json({
    success: true,
    message: "Staff member assigned successfully",
    assignment,
  });
}

/*
 * Remove a staff assignment
 */
export async function unassign(
  req: Request,
  res: Response
) {
  const booking =
    await unassignStaffFromBooking(
      String(req.params.id)
    );

  return res.status(200).json({
    success: true,
    message: "Staff member unassigned successfully",
    booking,
  });
}

/*
 * Get all bookings assigned to a staff member
 */
export async function getAssignments(
  req: Request,
  res: Response
) {
  const assignments =
    await getStaffAssignments(
      String(req.params.id)
    );

  return res.status(200).json({
    success: true,
    assignments,
  });
}

/*
 * Get all staff assigned to a booking
 */
export async function getBookingStaff(
  req: Request,
  res: Response
) {
  const assignments =
    await getBookingAssignments(
      String(req.params.id)
    );

  return res.status(200).json({
    success: true,
    assignments,
  });
}

export async function getMe(
  req: Request,
  res: Response
) {
  const staff = await getMyStaffProfile(
    req.user!.userId
  );

  return res.status(200).json({
    success: true,
    staff,
  });
}

export async function getMyAssignments(
  req: Request,
  res: Response
) {
  const assignments =
    await getMyStaffAssignments(
      req.user!.userId
    );

  return res.status(200).json({
    success: true,
    assignments,
  });
}

export async function updateMyAvailability(
  req: Request,
  res: Response
) {
  const staff =
    await updateMyStaffAvailability(
      req.user!.userId,
      req.body.isAvailable
    );

  return res.status(200).json({
    success: true,
    message:
      "Availability updated successfully",
    staff,
  });
}

export async function updateMyBookingStatus(
  req: Request,
  res: Response
) {
  const booking =
    await updateAssignedBookingStatus(
      req.user!.userId,
      String(req.params.id),
      req.body.status
    );

  return res.status(200).json({
    success: true,
    message:
      "Booking status updated successfully",
    booking,
  });
}