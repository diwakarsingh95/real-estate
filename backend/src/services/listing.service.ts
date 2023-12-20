import Listing, { ListingDocument } from "../models/listing.model";
import { errorHandler } from "../utils/errorHandler";

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

  const listing = await Listing.findById(id).where({ userRef: userId });
  if (!listing) throw errorHandler(404, "No listing found!");

  const updatedListingData = await Listing.findByIdAndUpdate(id, data, {
    new: true
  });
  return updatedListingData;
}
