import express from "express";
import {
  createListing,
  deleteListing,
  getListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getListings);
router.post("/create", verifyToken, createListing);
router.delete("/delete/:listingId", verifyToken, deleteListing);

export default router;
