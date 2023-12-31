import React from "react";
import { useSearchParams } from "react-router-dom";

const SearchFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy");
  const orderBy = searchParams.get("orderBy");
  const type = searchParams.get("type");
  const parking = searchParams.get("parking");
  const furnished = searchParams.get("furnished");

  const sortValue = sortBy
    ? orderBy
      ? sortBy.concat("_", orderBy)
      : sortBy.concat("_desc")
    : null;

  const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const { target } = e;
    const { name } = target;

    if (name === "sort") {
      const { value: sortValue } = target;
      if (sortValue) {
        const [sortBy, orderBy] = sortValue.split("_");
        searchParams.set("sortBy", sortBy);
        searchParams.set("orderBy", orderBy);
      }
    } else if (name === "rent") {
      const { checked } = target;
      if (checked) {
        if (type === "sale") searchParams.set("type", "all");
        else searchParams.set("type", "rent");
      } else if (type === "all") searchParams.set("type", "sale");
      else searchParams.delete("type");
    } else if (name === "sale") {
      const { checked } = target;
      if (checked) {
        if (type === "rent") searchParams.set("type", "all");
        else searchParams.set("type", "sale");
      } else if (type === "all") searchParams.set("type", "rent");
      else searchParams.delete("type");
    } else if (name === "parking") {
      const { checked } = target;
      searchParams.set("parking", `${checked}`);
    } else if (name === "furnished") {
      const { checked } = target;
      searchParams.set("furnished", `${checked}`);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchParams(searchParams);
  };

  return (
    <section className="p-4 mr-2 h-fit">
      <h2 className="text-xl font-semibold mb-3">Filters</h2>
      <form
        onSubmit={handleSubmit}
        onChange={handleChange}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="sort"
            className="font-semibold pb-1 mr-2 border-b border-slate-300"
          >
            Sort By
          </label>
          <select
            id="sort"
            name="sort"
            className="border rounded-lg py-1 px-2 w-fit"
            defaultValue={sortValue ? sortValue : "createdAt_desc"}
          >
            <option value="price_desc">Price - High to Low</option>
            <option value="price_asc">Price - Low to High</option>
            <option value="createdAt_desc">Latest</option>
            <option value="createdAt_asc">Oldest</option>
          </select>
        </div>
        <div className="flex flex-col gap-3">
          <span className="font-semibold pb-1 mr-2 border-b border-slate-300">
            Type
          </span>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="rent"
                className="w-4 h-4"
                defaultChecked={type === "rent"}
              />{" "}
              Rent
            </label>
            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="sale"
                className="w-4 h-4"
                defaultChecked={type === "sale"}
              />{" "}
              Sale
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <span className="font-semibold pb-1 mr-2 border-b border-slate-300">
            Amenities
          </span>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="parking"
                className="w-4 h-4"
                defaultChecked={parking === "true"}
              />{" "}
              Parking
            </label>
            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="furnished"
                className="w-4 h-4"
                defaultChecked={furnished === "true"}
              />{" "}
              Furnished
            </label>
          </div>
        </div>
        <button className="bg-slate-700 text-white px-2 py-1 rounded-lg uppercase hover:opacity-95 w-fit">
          Apply
        </button>
      </form>
    </section>
  );
};

export default SearchFilters;
