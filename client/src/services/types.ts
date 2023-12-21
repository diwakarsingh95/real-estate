export type User = {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserState = {
  currentUser: User | null;
  error: string;
  loading: boolean;
};

export type Listing = {
  _id: string;
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
  type: string;
  imageUrls: string[];
  // userRef: string;
  userRef: User;
};

export type ListingFormData = {
  imageUrls: string[];
  name: string;
  description: string;
  address: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  regularPrice: number;
  discountPrice: number;
  offer: boolean;
  parking: boolean;
  furnished: boolean;
};
