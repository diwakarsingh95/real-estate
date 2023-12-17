import express from "express";
import { createListing, getListings } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getListings);
router.post("/create", verifyToken, createListing);

export default router;
