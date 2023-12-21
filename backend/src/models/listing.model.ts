import mongoose, { Types } from "mongoose";

enum ListingType {
  SALE = "sale",
  RENT = "rent"
}

export interface ListingDocument {
  name: string;
  description: string;
  address: string;
  regularPrice: number;
  discountPrice: number;
  bathrooms: number;
  bedrooms: number;
  furnished: boolean;
  parking: boolean;
  offer: boolean;
  type: ListingType;
  imageUrls: string[];
  userRef: Types.ObjectId;
  _doc: Omit<this, "_doc">;
}

const listingSchema = new mongoose.Schema<ListingDocument>(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    regularPrice: {
      type: Number,
      required: true
    },
    discountPrice: {
      type: Number,
      required: true
    },
    bathrooms: {
      type: Number,
      required: true
    },
    bedrooms: {
      type: Number,
      required: true
    },
    furnished: {
      type: Boolean,
      required: true
    },
    parking: {
      type: Boolean,
      required: true
    },
    offer: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      enum: Object.values(ListingType),
      required: true
    },
    imageUrls: {
      type: [String],
      required: true
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

const Listing = mongoose.model<ListingDocument>("Listing", listingSchema);

export default Listing;
