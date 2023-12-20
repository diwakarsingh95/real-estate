import { Secret } from "jsonwebtoken";

export const JWT_SECRET: Secret =
  process.env.JWT_SECRET || "HsJFTRKNbBr8V5gTbhSwSa6OfBOQYYNQ";

export const SALT_ROUNDS = 12;
