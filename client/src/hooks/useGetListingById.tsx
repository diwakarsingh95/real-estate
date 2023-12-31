import { useAppSelector } from ".";
import { useGetUserListingsQuery } from "../redux/api/apiSlice";

export default function useGetUserListingById(id: string) {
  const { currentUser } = useAppSelector((state) => state.user);
  const { listing, error, isLoading } = useGetUserListingsQuery(undefined, {
    skip: !currentUser?._id || !id,
    selectFromResult: ({ data, isLoading, error }) => ({
      listing: data?.find(
        (listing) =>
          listing.userRef &&
          listing.userRef.toString() === currentUser?._id &&
          listing._id === id
      ),
      isLoading,
      error,
    }),
  });

  return { listing, error, isLoading };
}
