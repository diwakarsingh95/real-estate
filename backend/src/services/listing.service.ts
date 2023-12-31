import Listing, { ListingDocument } from "../models/listing.model";
import { UserDocument } from "../models/user.model";
import { errorHandler } from "../utils/errorHandler";

type FilterProps = {
  limit?: string;
  offset?: string;
  offer?: false | boolean;
  furnished?: false | boolean;
  parking?: boolean;
  type?: "all" | "sale" | "rent";
  q?: string;
  sortBy?: string;
  orderBy?: "desc" | "asc";
};

export async function getListings(filters: FilterProps) {
  const {
    limit: limitAsString = "10",
    offset: offsetString = "0",
    q = "",
    sortBy = "createdAt",
    orderBy = "desc",
    ...rest
  }: FilterProps = filters;

  let limit = parseInt(limitAsString);
  limit = isNaN(limit) ? 9 : limit;
  let offset = parseInt(offsetString);
  offset = isNaN(offset) ? 0 : offset;

  if (rest.type === "all") delete rest.type;

  let queryParams = {};
  if (!!q) queryParams = { ...queryParams, name: { $regex: q, $options: "i" } };
  if (rest) queryParams = { ...queryParams, ...rest };

  const listings = await Listing.find(queryParams)
    .sort({ [sortBy]: orderBy })
    .limit(limit)
    .skip(offset);

  const totalListingCount = await Listing.countDocuments({
    name: { $regex: q, $options: "i" },
    ...rest
  });

  const hasMore = offset + limit < totalListingCount;
  return { listings, hasMore };
}

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

export async function searchListing(data: any) {
  const {
    limit: limitAsString = "10",
    offset: offsetString = "0",
    q = "",
    sortBy = "createdAt",
    orderBy = "desc",
    ...rest
  }: FilterProps = data;

  let limit = parseInt(limitAsString);
  limit = isNaN(limit) ? 9 : limit;
  let offset = parseInt(offsetString);
  offset = isNaN(offset) ? 0 : offset;

  if (rest.type === "all") delete rest.type;

  const listings = await Listing.find({
    name: { $regex: q, $options: "i" },
    ...rest
  })
    .sort({ [sortBy]: orderBy })
    .limit(limit)
    .skip(offset);

  const totalListingCount = await Listing.countDocuments({
    name: { $regex: q, $options: "i" },
    ...rest
  });

  const hasMore = offset + limit < totalListingCount;
  return { listings, hasMore };
}
