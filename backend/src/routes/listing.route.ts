import express from "express";
import {
  createListing,
  deleteListing,
  getListings,
  updateListing,
  getListing
} from "../controllers/listing.controller";

const router = express.Router();

router.get("/", getListings);
router.get("/:listingId", getListing);
router.post("/create", createListing);
router.delete("/delete/:listingId", deleteListing);
router.post("/update/:listingId", updateListing);

export default router;
