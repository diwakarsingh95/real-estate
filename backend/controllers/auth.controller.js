import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  const hashedPassword = bcryptjs.hashSync(password, 12);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json("User created successfully!");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
