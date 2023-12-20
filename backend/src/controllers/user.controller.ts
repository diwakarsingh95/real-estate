import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../utils/errorHandler";
import User from "../models/user.model";
import { CustomRequest } from "../middlewares/auth.middleware";
import * as userService from "../services/user.service";

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req as CustomRequest).user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));

  try {
    const udpatedUser = await userService.update(req.body, req.params.id);
    res.status(200).json(udpatedUser);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req as CustomRequest).user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted!");
  } catch (err) {
    console.error(err);
    next(err);
  }
};
