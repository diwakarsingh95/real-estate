import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from "firebase/storage";
import { app } from "../firebase";
import { getErrorMessage } from "../services/helpers";
import { Listing, ListingFormData } from "../services/types";

type ListingFormProps = {
  data?: Listing;
  onSubmit: (data: ListingFormData) => void;
  isLoading: boolean;
};

const ListingForm = ({ onSubmit, isLoading, data }: ListingFormProps) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [formData, setFormData] = useState({
    imageUrls: data?.imageUrls || ([] as string[]),
    name: data?.name || "",
    description: data?.description || "",
    address: data?.address || "",
    type: data?.type || "rent",
    bedrooms: data?.bedrooms || 1,
    bathrooms: data?.bathrooms || 1,
    regularPrice: data?.regularPrice || 50,
    discountPrice: data?.discountPrice || 0,
    offer: data?.offer || false,
    parking: data?.parking || false,
    furnished: data?.furnished || false
  });
  const [formError, setFormError] = useState("");
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFiles(e.currentTarget.files);

  const handleImageFilesUpload = async () => {
    if (
      files &&
      files.length > 0 &&
      files.length + formData.imageUrls.length < 7
    ) {
      try {
        setUploadingImages(true);
        setImageUploadError("");
        const imageUrls = await Promise.all(
          Array.from(files).map((file) => {
            return storeImage(file);
          })
        );
        setFormData((prevState) => ({
          ...prevState,
          imageUrls: prevState.imageUrls.concat(imageUrls)
        }));
        setImageUploadError("");
        setUploadingImages(false);
      } catch (error) {
        setImageUploadError("Image upload failed (2 MB max per image).");
        setUploadingImages(false);
      }
    } else {
      setImageUploadError("You can only upload 6 images per listing.");
    }
  };

  const storeImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) =>
            resolve(downloadUrl)
          );
        }
      );
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index)
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, type, value } = e.currentTarget;

    if (type === "radio") setFormData({ ...formData, type: e.target.value });
    else if (type === "checkbox")
      setFormData({
        ...formData,
        [id]: (e.currentTarget as HTMLInputElement).checked
      });
    else if (type === "number")
      setFormData({ ...formData, [id]: parseFloat(value) });
    else setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!formData.imageUrls.length)
        return setFormError("You must upload at least one image.");
      if (formData.offer && formData.regularPrice < formData.discountPrice)
        return setFormError(
          "Regular price can not be less than discounted price."
        );
      setFormError("");

      await onSubmit(formData);
    } catch (err) {
      console.error(err);
      const errMsg = getErrorMessage(err);
      setFormError(errMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <div className="flex flex-col flex-1 gap-4">
        <input
          type="text"
          placeholder="Name"
          className="border p-3 rounded-lg"
          id="name"
          maxLength={62}
          minLength={10}
          required
          value={formData.name}
          onChange={handleChange}
          autoComplete="on"
        />
        <textarea
          placeholder="Description"
          className="border p-3 rounded-lg"
          id="description"
          required
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Address"
          className="border p-3 rounded-lg"
          id="address"
          required
          value={formData.address}
          onChange={handleChange}
          autoComplete="street-address"
        />
        <div className="flex flex-wrap gap-6">
          <label className="flex gap-2">
            <input
              type="radio"
              name="type"
              className="w-5"
              value="sale"
              onChange={handleChange}
              checked={formData.type === "sale"}
            />
            Sell
          </label>
          <label className="flex gap-2">
            <input
              type="radio"
              name="type"
              className="w-5"
              value="rent"
              onChange={handleChange}
              checked={formData.type === "rent"}
            />
            Rent
          </label>
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex gap-2">
            <input
              type="checkbox"
              id="parking"
              className="w-5"
              checked={formData.parking}
              onChange={handleChange}
            />
            Parking Spot
          </label>
          <label className="flex gap-2">
            <input
              type="checkbox"
              id="furnished"
              className="w-5"
              checked={formData.furnished}
              onChange={handleChange}
            />
            Furnished
          </label>
          <label className="flex gap-2">
            <input
              type="checkbox"
              id="offer"
              className="w-5"
              checked={formData.offer}
              onChange={handleChange}
            />
            Offer
          </label>
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input
              className="p-3 border border-gray-300 rounded-lg"
              type="number"
              id="bedrooms"
              min={1}
              max={10}
              required
              value={formData.bedrooms}
              onChange={handleChange}
            />
            Beds
          </label>
          <label className="flex items-center gap-2">
            <input
              className="p-3 border border-gray-300 rounded-lg"
              type="number"
              id="bathrooms"
              min={1}
              max={10}
              required
              value={formData.bathrooms}
              onChange={handleChange}
            />
            Baths
          </label>
          <label className="flex items-center gap-2">
            <input
              className="p-3 border border-gray-300 rounded-lg"
              type="number"
              id="regularPrice"
              min={50}
              max={1000000}
              required
              value={formData.regularPrice}
              onChange={handleChange}
            />
            <span className="flex flex-col items-center">
              Regular Price
              <span className="text-xs">($ / Month)</span>
            </span>
          </label>
          {formData.offer && (
            <label className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="discountPrice"
                min={0}
                max={1000000}
                value={formData.discountPrice}
                onChange={handleChange}
                autoComplete=""
              />
              <span className="flex flex-col items-center">
                Discounted Price
                <span className="text-xs">($ / Month)</span>
              </span>
            </label>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-1 gap-4">
        <p className="font-semibold">
          Images:{" "}
          <span className="font-normal text-gray-600 ml-2">
            The first image will be the cover (max 6).
          </span>
        </p>
        <div className="flex gap-4">
          <input
            className="p-3 border border-gray-300 rounded w-full"
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageFilesChange}
          />
          <button
            type="button"
            className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            disabled={isLoading || uploadingImages}
            onClick={handleImageFilesUpload}
          >
            {uploadingImages ? "Uploading..." : "Upload"}
          </button>
        </div>
        {!!imageUploadError && (
          <p className="text-red-700 text-sm">{imageUploadError}</p>
        )}
        {formData.imageUrls.map((url, index) => (
          <div
            key={url.slice(-8)}
            className="flex justify-between p-3 border items-center"
          >
            <img
              src={url}
              alt="Listing"
              className="w-20 h-20 object-contain rounded-lg"
            />
            <button
              className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
              onClick={() => handleRemoveImage(index)}
              disabled={isLoading || uploadingImages}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          disabled={isLoading || uploadingImages}
        >
          {isLoading
            ? data
              ? "Updating..."
              : "Creating..."
            : `${data ? "Update" : "Create"} Listing`}
        </button>
        {!!formError && <p className="text-red-700 text-sm">{formError}</p>}
      </div>
    </form>
  );
};

export default ListingForm;
