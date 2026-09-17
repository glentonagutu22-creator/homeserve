import { Request, Response } from "express";

import {
  createQuote,
  getCustomerQuote,
  getCustomerQuotes,
  acceptQuote,
  rejectQuote,
    getAllQuotes,
  getAdminQuote,
  updateAdminQuote,
  sendAdminQuote,
} from "./quote.service";

/**
 * Create a quote
 */
export async function create(req: Request, res: Response) {
  const quote = await createQuote(
    req.user!.userId,
    req.body
  );

  return res.status(201).json({
    success: true,
    message: "Quote created successfully",
    quote,
  });
}

/**
 * Get all quotes belonging to the
 * authenticated customer.
 */
export async function getMyQuotes(
  req: Request,
  res: Response
) {
  const quotes = await getCustomerQuotes(
    req.user!.userId
  );

  return res.status(200).json({
    success: true,
    quotes,
  });
}

/**
 * Get a single customer quote.
 */
export async function getMyQuote(
  req: Request,
  res: Response
) {
  const quote = await getCustomerQuote(
    req.user!.userId,
    String(req.params.id)
  );

  return res.status(200).json({
    success: true,
    quote,
  });
}

/**
 * Update a pending quote.


/**
 * Send a quote to the customer.
 */
export async function send(
  req: Request,
  res: Response
) {
  const quote = await sendAdminQuote(
    String(req.params.id)
  );

  return res.status(200).json({
    success: true,
    message: "Quote sent successfully",
    quote,
  });
}
/**
 * Accept a quote.
 */
export async function accept(
  req: Request,
  res: Response
) {
  const result = await acceptQuote(
    req.user!.userId,
    String(req.params.id)
  );

  return res.status(200).json({
    success: true,
    message: "Quote accepted successfully",
    quote: result.quote,
    booking: result.booking,
  });
}

/**
 * Reject a quote.
 */
export async function reject(
  req: Request,
  res: Response
) {
  const result = await rejectQuote(
    req.user!.userId,
    String(req.params.id)
  );

  return res.status(200).json({
    success: true,
    message: "Quote rejected successfully",
    quote: result.quote,
    booking: result.booking,
  });
}

/*
|--------------------------------------------------------------------------
| Admin - Get all quotes
|--------------------------------------------------------------------------
*/

export async function getAll(req: Request, res: Response) {
  const quotes = await getAllQuotes();

  return res.status(200).json({
    success: true,
    quotes,
  });
}

/*
|--------------------------------------------------------------------------
| Admin - Get single quote
|--------------------------------------------------------------------------
*/

export async function getAdmin(
  req: Request,
  res: Response
) {
  const quote = await getAdminQuote(
    String(req.params.id)
  );

  return res.status(200).json({
    success: true,
    quote,
  });
}

/*
|--------------------------------------------------------------------------
| Admin - Update quote
|--------------------------------------------------------------------------
*/

export async function updateAdmin(
  req: Request,
  res: Response
) {
  const quote = await updateAdminQuote(
    String(req.params.id),
    req.body
  );

  return res.status(200).json({
    success: true,
    message: "Quote updated successfully",
    quote,
  });
}