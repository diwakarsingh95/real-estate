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
  userRef: string;
};
