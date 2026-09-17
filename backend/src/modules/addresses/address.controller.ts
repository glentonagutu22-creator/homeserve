import { Request, Response } from "express";

import {
  createAddress,
  getCustomerAddresses,
  getCustomerAddress,
  updateAddress,
  deleteAddress,
} from "./address.service";

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export async function create(
  req: Request,
  res: Response
) {
  const address = await createAddress(
    req.user!.userId,
    req.body
  );

  return res.status(201).json({
    success: true,
    message: "Address created successfully",
    address,
  });
}

/*
|--------------------------------------------------------------------------
| Get My Addresses
|--------------------------------------------------------------------------
*/

export async function getMine(
  req: Request,
  res: Response
) {
  const addresses =
    await getCustomerAddresses(
      req.user!.userId
    );

  return res.status(200).json({
    success: true,
    addresses,
  });
}

/*
|--------------------------------------------------------------------------
| Get One Address
|--------------------------------------------------------------------------
*/

export async function getOne(
  req: Request,
  res: Response
) {
  const address =
    await getCustomerAddress(
      req.user!.userId,
      String(req.params.id)
    );

  return res.status(200).json({
    success: true,
    address,
  });
}

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export async function update(
  req: Request,
  res: Response
) {
  const address =
    await updateAddress(
      req.user!.userId,
      String(req.params.id),
      req.body
    );

  return res.status(200).json({
    success: true,
    message: "Address updated successfully",
    address,
  });
}

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export async function remove(
  req: Request,
  res: Response
) {
  await deleteAddress(
    req.user!.userId,
    String(req.params.id)
  );

  return res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
}