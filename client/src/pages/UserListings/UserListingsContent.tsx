import { Link } from "react-router-dom";
import ListingItem from "./UserListingItem";
import { getErrorMessage } from "../../utils/helpers";
import { useAppSelector } from "../../hooks";
import { useGetUserListingsQuery } from "../../redux/api/apiSlice";

const ListingsContent = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  const {
    data: listings,
    isLoading,
    error
  } = useGetUserListingsQuery(undefined, {
    skip: !currentUser?._id
  });

  if (isLoading) return <p className="text-gray-600 text-xl">Loading...</p>;
  if (error)
    return <p className="text-red-700 text-xl">{getErrorMessage(error)}</p>;

  return (
    <div className="flex flex-col gap-4">
      {listings && listings.length > 0 ? (
        listings.map((listing) => (
          <ListingItem key={listing._id} data={listing} />
        ))
      ) : (
        <>
          <p className="text-gray-600 text-xl mt-5">
            No listings found.{" "}
            <Link
              to="/create-listing"
              className="text-cyan-700 hover:underline"
            >
              Create new
            </Link>
            .
          </p>
        </>
      )}
    </div>
  );
};

export default ListingsContent;
