import bcryptjs from "bcryptjs";
import User, { UserDocument } from "../models/user.model";
import { SALT_ROUNDS } from "../utils/constants";

export async function update(userData: UserDocument, id: string) {
  const { username, email, avatar } = userData;
  let { password } = userData;

  if (password) {
    password = bcryptjs.hashSync(password, SALT_ROUNDS);
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      $set: {
        username,
        email,
        password,
        avatar
      }
    },
    { new: true }
  );

  return updatedUser;
}
