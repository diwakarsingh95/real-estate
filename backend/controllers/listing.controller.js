import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const getListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ userRef: req.user.id });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId);

    if (!listing) return next(errorHandler(404, "No listing found!"));

    if (listing._id.toString() !== listingId)
      return next(errorHandler(401, "You can only delete your own listings!"));

    const deletedListingData = await Listing.findByIdAndDelete(listingId);
    res.status(200).json(deletedListingData);
  } catch (error) {
    next(error);
  }
};
