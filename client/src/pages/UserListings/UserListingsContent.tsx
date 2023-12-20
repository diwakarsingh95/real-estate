import { Link } from "react-router-dom";
import { useGetListingsQuery } from "../../redux/api/apiSlice";
import ListingItem from "./UserListingItem";
import { useAppSelector } from "../../hooks";
import { getErrorMessage } from "../../services/helpers";

const ListingsContent = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  const {
    data: listData,
    error,
    isLoading
  } = useGetListingsQuery(currentUser?._id || "", { skip: !currentUser?._id });

  if (isLoading) return <p className="text-gray-600 text-xl">Loading...</p>;
  if (error)
    return <p className="text-red-700 text-xl">{getErrorMessage(error)}</p>;

  return (
    <div className="flex flex-col gap-4">
      {listData && listData.length > 0 ? (
        listData.map((listing) => (
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
