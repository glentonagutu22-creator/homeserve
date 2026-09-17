import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Customer ID
|--------------------------------------------------------------------------
*/

export const customerIdSchema = z.object({
  id: z.string().uuid("Invalid customer ID"),
});

/*
|--------------------------------------------------------------------------
| Change customer role
|--------------------------------------------------------------------------
*/

export const changeCustomerRoleSchema =
  z.object({
    role: z.enum(["CUSTOMER", "ADMIN"]),
  });