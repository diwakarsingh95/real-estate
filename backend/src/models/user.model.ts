import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { SALT_ROUNDS } from "../utils/constants";

export interface UserDocument {
  username: string;
  email: string;
  password: string;
  avatar: string;
  _doc: Omit<this, "_doc">;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  console.log;
  if (user.isModified("password"))
    user.password = await bcryptjs.hash(user.password, SALT_ROUNDS);

  next();
});

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
