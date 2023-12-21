import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler";
import { JWT_SECRET } from "../utils/constants";

type User = {
  id: string;
};

export interface CustomRequest extends Request {
  user: User;
}

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { url, baseUrl } = req;
    if (baseUrl.concat(url) === "/api/listing/") return next();

    const token = req.cookies.access_token;

    if (!token) return next(errorHandler(401, "Please authenticate."));

    const user = jwt.verify(token, JWT_SECRET);
    if (typeof user !== "string" && "id" in user) {
      (req as CustomRequest).user = user as User;
      next();
    } else {
      res.clearCookie("access_token");
      next(errorHandler(401, "Please authenticate."));
    }
  } catch (err) {
    next(errorHandler(401, "Please authenticate."));
  }
}
