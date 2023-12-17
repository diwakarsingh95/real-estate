import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetListingsQuery } from "../../redux/api/apiSlice";

const ListingsContent = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { data, error, isLoading } = useGetListingsQuery(currentUser._id);

  if (isLoading) return <p className="text-gray-600 text-xl">Loading...</p>;
  if (error) return <p className="text-red-700 text-xl">{error.message}</p>;

  return (
    <div className="flex flex-col gap-4">
      {data && data.length > 0 ? (
        data.map((listing) => (
          <div
            key={listing._id}
            className="border rounded-lg p-3 flex justify-between items-center gap-4"
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt="listing cover"
                className="h-16 w-16 object-contain"
              />
            </Link>
            <Link
              className="text-slate-700 font-semibold  hover:underline truncate flex-1 capitalize"
              to={`/listing/${listing._id}`}
            >
              {listing.name}
            </Link>

            <div className="flex flex-col item-center">
              <button className="text-red-700 uppercase">Delete</button>
              <button className="text-green-700 uppercase">Edit</button>
            </div>
          </div>
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
