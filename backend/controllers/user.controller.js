import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import User from "../models/user.model.js";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const { username, email, password, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username,
          email,
          password,
          avatar,
        },
      },
      { new: true }
    );

    const { password: pass, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
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
