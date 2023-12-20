import { HydratedDocument } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { UserDocument } from "../models/user.model";
import { errorHandler } from "../utils/errorHandler";
import { JWT_SECRET } from "../utils/constants";

type SignInResult = {
  userInfo: Partial<UserDocument>;
  token: string | JwtPayload;
};

export async function signIn(
  email: string,
  password: string
): Promise<SignInResult> {
  const foundUser = await User.findOne({
    email
  }).select("+password");

  if (!foundUser) {
    throw errorHandler(404, "User not found!");
  }

  const isValidPassword = await bcryptjs.compare(password, foundUser.password);

  if (!isValidPassword) throw errorHandler(401, "Wrong credentials!");
  const token = jwt.sign({ id: foundUser._id.toString() }, JWT_SECRET, {
    expiresIn: "7d"
  });

  const { password: pass, ...userInfo } = foundUser._doc;
  return { userInfo, token };
}

export async function signUp(
  username: string,
  email: string,
  password: string
) {
  await User.create({ username, email, password });
}

export async function googleSignIn({
  name,
  email,
  photo
}: {
  name: string;
  email: string;
  photo: string;
}): Promise<SignInResult> {
  const foundUser = await User.findOne({ email });
  if (foundUser) {
    const token = jwt.sign({ id: foundUser._id.toString() }, JWT_SECRET, {
      expiresIn: "7d"
    });
    return { userInfo: foundUser._doc, token };
  }

  const randomPassword =
    Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
  const newUser = await User.create({
    username:
      name.split(" ").join("").toLowerCase() +
      Math.random().toString(36).slice(-5),
    email,
    password: randomPassword,
    avatar: photo
  });
  const token = jwt.sign({ id: newUser?._id.toString() }, JWT_SECRET, {
    expiresIn: "7d"
  });
  const { password: pass, ...userInfo } = newUser._doc;
  return { userInfo, token };
}
