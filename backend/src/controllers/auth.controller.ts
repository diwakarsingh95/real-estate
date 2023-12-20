import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";
import { errorHandler } from "../utils/errorHandler";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      next(errorHandler(400, "Missing required fields."));
    }

    await authService.signUp(username, email, password);
    res.status(201).json("User created successfully!");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const { userInfo, token } = await authService.signIn(email, password);
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(userInfo);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const googleSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userInfo, token } = await authService.googleSignIn(req.body);
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(userInfo);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const signOut = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("Logged out successfully!");
  } catch (err) {
    console.error(err);
    next(err);
  }
};
