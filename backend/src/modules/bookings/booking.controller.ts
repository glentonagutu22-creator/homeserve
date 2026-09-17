import { Request, Response } from "express";

import {
  createBooking,
  getCustomerBookings,
  getCustomerBooking,
  cancelCustomerBooking,
  getAllBookings,
  getAdminBooking,
} from "./booking.service";

export async function create(
  req: Request,
  res: Response
) {
  const booking = await createBooking(
    req.user!.userId,
    req.body
  );

  return res.status(201).json({
    success: true,
    message: "Booking created successfully",
    booking,
  });
}

/*
|--------------------------------------------------------------------------
| Customer — Get My Bookings
|--------------------------------------------------------------------------
*/

export async function getMyBookings(
  req: Request,
  res: Response
) {
  const bookings =
    await getCustomerBookings(
      req.user!.userId
    );

  return res.status(200).json({
    success: true,
    bookings,
  });
}

/*
|--------------------------------------------------------------------------
| Customer — Get My Booking
|--------------------------------------------------------------------------
*/

export async function getMyBooking(
  req: Request,
  res: Response
) {
  const booking =
    await getCustomerBooking(
      req.user!.userId,
      String(req.params.id)
    );

  return res.status(200).json({
    success: true,
    booking,
  });
}

/*
|--------------------------------------------------------------------------
| Admin — Get All Bookings
|--------------------------------------------------------------------------
*/

export async function getAdminBookings(
  _req: Request,
  res: Response
) {
  const bookings =
    await getAllBookings();

  return res.status(200).json({
    success: true,
    bookings,
  });
}

/*
|--------------------------------------------------------------------------
| Admin — Get Single Booking
|--------------------------------------------------------------------------
*/

export async function getAdminBookingById(
  req: Request,
  res: Response
) {
  const booking =
    await getAdminBooking(
      String(req.params.id)
    );

  return res.status(200).json({
    success: true,
    booking,
  });
}

/*
|--------------------------------------------------------------------------
| Customer — Cancel Booking
|--------------------------------------------------------------------------
*/

export async function cancel(
  req: Request,
  res: Response
) {
  const booking =
    await cancelCustomerBooking(
      req.user!.userId,
      String(req.params.id),
      req.body.reason
    );

  return res.status(200).json({
    success: true,
    message:
      "Booking cancelled successfully",
    booking,
  });
}