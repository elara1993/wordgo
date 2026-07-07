import { Request, Response, NextFunction } from "express";

export const validateBody = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missing = requiredFields.filter((field) => !req.body[field]);
    if (missing.length > 0) {
      res.status(400).json({
        success: false,
        error: `Missing required fields: ${missing.join(", ")}`,
      });
      return;
    }
    next();
  };
};

export const validateQuery = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missing = requiredFields.filter((field) => !req.query[field]);
    if (missing.length > 0) {
      res.status(400).json({
        success: false,
        error: `Missing required query params: ${missing.join(", ")}`,
      });
      return;
    }
    next();
  };
};
