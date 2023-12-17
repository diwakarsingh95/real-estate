import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetListingsQuery } from "../../redux/api/apiSlice";
import ListingItem from "./ListingItem";

const ListingsContent = () => {
  const { currentUser } = useSelector((state) => state.user);
  const {
    data: listData,
    error,
    isLoading,
  } = useGetListingsQuery(currentUser._id);

  if (isLoading) return <p className="text-gray-600 text-xl">Loading...</p>;
  if (error) return <p className="text-red-700 text-xl">{error.message}</p>;

  return (
    <div className="flex flex-col gap-4">
      {listData && listData.length > 0 ? (
        listData.map((listing) => (
          <ListingItem
            key={listing._id}
            data={listing}
          />
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
