import mongoose from "mongoose";
import Listing, { ListingDocument } from "../models/listing.model";
import { errorHandler } from "../utils/errorHandler";

export async function getListing(id: string) {
  if (!id) throw errorHandler(404, "No listing found!");

  const listing = await Listing.findById(id).populate("userRef");
  if (!listing) throw errorHandler(404, "No listing found!");

  return listing;
}

export async function deleteListing(id: string) {
  if (!id) throw errorHandler(404, "No listing found!");

  const listing = await Listing.findById(id);
  if (!listing) throw errorHandler(404, "No listing found!");

  if (listing._id.toString() !== id)
    throw errorHandler(401, "You can only delete your own listings!");

  const deletedListingData = await Listing.findByIdAndDelete(id);
  return deletedListingData;
}

export async function updateListing(
  id: string,
  userId: string,
  data: Partial<ListingDocument>
) {
  if (!id) throw errorHandler(404, "No listing found!");

  const listing = await Listing.findOne({ _id: id });

  if (!listing || userId !== listing?.userRef.toString())
    throw errorHandler(404, "No listing found!");

  const updatedListingData = await Listing.findByIdAndUpdate(id, data, {
    new: true
  });
  return updatedListingData;
}

type SearchProps = {
  limit: string;
  offset: string;
  offer?: false | boolean;
  furnished?: false | boolean;
  parking?: boolean;
  type?: "sale" | "rent";
  q: string;
  sortBy?: string;
  orderBy?: "desc" | "asc";
};

export async function searchListing(data: any) {
  const {
    limit: limitAsString = "9",
    offset: offsetString = "0",
    q = "",
    sortBy = "createdAt",
    orderBy = "desc",
    ...rest
  }: SearchProps = data;

  let limit = parseInt(limitAsString);
  limit = isNaN(limit) ? 9 : limit;
  let offset = parseInt(offsetString);
  offset = isNaN(offset) ? 0 : offset;

  console.log("Data", data);

  const listings = await Listing.find({
    name: { $regex: q, $options: "i" },
    ...rest
  })
    .sort({ [sortBy]: orderBy })
    .limit(limit)
    .skip(offset);
  return listings;
}
