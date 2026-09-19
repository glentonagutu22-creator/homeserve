import { Request, Response } from "express";

import {
  getAllCustomers,
  getCustomerById,
  changeUserRole,
  deleteCustomer,
  updateMyProfile,
} from "./user.service";
/*
|--------------------------------------------------------------------------
| Admin — Get all customers
|--------------------------------------------------------------------------
*/

export async function getCustomers(
  _req: Request,
  res: Response
) {
  const customers =
    await getAllCustomers();

  return res.status(200).json({
    success: true,
    customers,
  });
}

/*
|--------------------------------------------------------------------------
| Admin — Get single customer
|--------------------------------------------------------------------------
*/

export async function getCustomer(
  req: Request,
  res: Response
) {
  const customer =
    await getCustomerById(
      String(req.params.id)
    );

  return res.status(200).json({
    success: true,
    customer,
  });
}

/*
|--------------------------------------------------------------------------
| Admin — Change customer role
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Admin — Change user role
|--------------------------------------------------------------------------
*/

export async function updateCustomerRole(
  req: Request,
  res: Response
) {
  const user =
    await changeUserRole(
      req.user!.userId,
      String(req.params.id),
      req.body.role
    );

  return res.status(200).json({
    success: true,
    message:
      "User role updated successfully",
    user,
  });
}

/*
|--------------------------------------------------------------------------
| Admin — Delete customer
|--------------------------------------------------------------------------
*/

export async function removeCustomer(
  req: Request,
  res: Response
) {
  const customer =
    await deleteCustomer(
      String(req.params.id)
    );

  return res.status(200).json({
    success: true,
    message:
      "Customer deleted successfully",
    customer,
  });
}

/*
|--------------------------------------------------------------------------
| Authenticated user — Update own profile
|--------------------------------------------------------------------------
*/

export async function updateProfile(
  req: Request,
  res: Response
) {
  const user =
    await updateMyProfile(
      req.user!.userId,
      {
        name: req.body.name,
        phone: req.body.phone,
      }
    );

  return res.status(200).json({
    success: true,
    message:
      "Profile updated successfully",
    user,
  });
}