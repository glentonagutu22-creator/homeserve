import {
  Request,
  Response,
  NextFunction,
} from "express";
import { ZodSchema } from "zod";

type ValidationTarget =
  | "body"
  | "params"
  | "query";

export function validate(
  schema: ZodSchema,
  target: ValidationTarget = "body"
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const data = req[target];
    

    const result =
      schema.safeParse(data);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map(
          (issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })
        ),
      });

      return;
    }

    if (target === "body") {
      req.body = result.data;
    }

    return next();
  };
}