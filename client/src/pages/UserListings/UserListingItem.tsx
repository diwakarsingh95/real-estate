import { Link } from "react-router-dom";
import clsx from "clsx";
import { useDeleteListingMutation } from "../../redux/api/apiSlice";
import { Listing } from "../../utils/types";

const ListingItem = ({ data }: { data: Listing }) => {
  const [deleteListing, { isLoading }] = useDeleteListingMutation();

  const handleDelete = () => deleteListing(data._id);

  return (
    <div
      className={clsx(
        "border rounded-lg p-3 flex justify-between items-center gap-4",
        isLoading && "pointer-events-none opacity-70 transition-opacity"
      )}
    >
      <Link to={`/listings/${data._id}`}>
        <img
          src={data.imageUrls[0]}
          alt="listing cover"
          className="h-16 w-16 object-contain"
        />
      </Link>
      <Link
        className="text-slate-700 font-semibold  hover:underline truncate flex-1 capitalize"
        to={`/listing/${data._id}`}
      >
        {data.name}
      </Link>

      <div className="flex flex-col item-center">
        <button
          className="text-red-700 uppercase"
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </button>
        <Link
          to={`/edit-listing/${data._id}`}
          className={clsx(
            "text-green-700 uppercase",
            isLoading && "pointer-events-none"
          )}
        >
          Edit
        </Link>
      </div>
    </div>
  );
};

export default ListingItem;
