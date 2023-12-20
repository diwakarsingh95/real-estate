import { Link, useNavigate, useParams } from "react-router-dom";
import ListingForm from "../components/ListingForm";
import {
  useGetListingQuery,
  useUpdateListingMutation
} from "../redux/api/apiSlice";
import { useAppSelector } from "../hooks";
import { ListingFormData } from "../services/types";

const EditListing = () => {
  const params = useParams();
  const { id } = params;
  const { currentUser } = useAppSelector((state) => state.user);
  const [updateListing, { isLoading }] = useUpdateListingMutation();
  const navigate = useNavigate();
  const { data: listing, error } = useGetListingQuery(id as string, {
    skip: !id
  });

  if (!listing || !id || error)
    return (
      <p className="text-gray-600 text-xl m-10">
        No listing found. Go to your{" "}
        <Link to="/listings" className="text-cyan-700 hover:underline">
          listings
        </Link>
        .
      </p>
    );

  const handleSubmit = async (formData: ListingFormData) => {
    const response = await updateListing({
      ...formData,
      userRef: currentUser?._id,
      _id: params.id
    });
    if ("error" in response) throw response.error;
    navigate(`/listings/${response.data._id}`);
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Edit Listing</h1>
      <ListingForm
        data={listing}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </main>
  );
};

export default EditListing;
