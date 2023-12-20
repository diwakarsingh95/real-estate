import express from "express";
import {
  googleSignIn,
  signIn,
  signUp,
  signOut
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/google", googleSignIn);
router.get("/signout", signOut);

export default router;
