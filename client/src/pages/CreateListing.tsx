import { useNavigate } from "react-router-dom";
import ListingForm from "../components/ListingForm";
import { useCreateListingMutation } from "../redux/api/apiSlice";
import { useAppSelector } from "../hooks";
import { ListingFormData, User } from "../services/types";

const CreateListing = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  const [createListing, { isLoading }] = useCreateListingMutation();
  const navigate = useNavigate();

  const handleSubmit = async (formData: ListingFormData) => {
    const response = await createListing({
      ...formData,
      userRef: currentUser as User
    });
    if ("error" in response) return response.error;
    navigate(`/listing/${response.data._id}`);
  };

  return (
    <div className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <ListingForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default CreateListing;
