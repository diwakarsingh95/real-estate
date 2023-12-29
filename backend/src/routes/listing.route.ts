import express from "express";
import {
  createListing,
  deleteListing,
  getListings,
  updateListing,
  getListing,
  getUserListings,
  searchListings
} from "../controllers/listing.controller";

const router = express.Router();

router.get("/", getListings);
router.get("/userListings", getUserListings);
router.get("/search", searchListings);
router.get("/:listingId", getListing);
router.post("/create", createListing);
router.post("/update/:listingId", updateListing);
router.delete("/delete/:listingId", deleteListing);

export default router;
