import express from "express";
import {
  createListing,
  deleteListing,
  getListings
} from "../controllers/listing.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, getListings);
router.post("/create", authMiddleware, createListing);
router.delete("/delete/:listingId", authMiddleware, deleteListing);

export default router;
