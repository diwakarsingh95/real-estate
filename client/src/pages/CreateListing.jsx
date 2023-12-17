const CreateListing = () => {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col flex-1 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={62}
            minLength={10}
            required
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />
          <div className="flex flex-wrap gap-6">
            <label className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              Sell
            </label>
            <label className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              Rent
            </label>
            <label className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              Parking Spot
            </label>
            <label className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              Furnished
            </label>
            <label className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
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
              />
              Baths
            </label>
            <label className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                min={1}
                max={10}
                required
              />
              <span className="flex flex-col items-center">
                Regular Price
                <span className="text-xs">($ / Month)</span>
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="discountPrice"
                min={1}
                max={10}
                required
              />
              <span className="flex flex-col items-center">
                Discounted Price
                <span className="text-xs">($ / Month)</span>
              </span>
            </label>
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
            />
            <button
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              Upload
            </button>
          </div>
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
