import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";
import { Request, Response, NextFunction } from "express";

const validateRequest = (type: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const input = plainToClass(type, req.body);
    const errors = await validate(input);

    if (errors.length > 0) {
      const messages = errors
        .map((error: ValidationError) =>
          Object.values(error.constraints ?? {}).join(". ")
        )
        .join(". ");

      return res.status(400).json({ result: "error", message: messages });
    }

    req.body = input;
    next();
  };
};

export default validateRequest;
