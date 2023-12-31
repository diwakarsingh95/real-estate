import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  MdKeyboardDoubleArrowUp,
  MdKeyboardDoubleArrowDown
} from "react-icons/md";
import SearchFilters from "./SearchFilters";
import useWindowSize from "../../hooks/useWindowSize";
import { useSearchListingsQuery } from "../../redux/api/apiSlice";
import { useSearchParams } from "react-router-dom";
import ListingItem from "../../components/ListingItem";

const Search = () => {
  const { width: windowWidth } = useWindowSize();
  const [showFilters, setShowFilter] = useState(false);
  const [searchParams] = useSearchParams();
  const { data: listings, isLoading } = useSearchListingsQuery(
    searchParams.toString()
  );

  const isMobileView = windowWidth < 768;

  useEffect(() => {
    if (listings) scrollTo({ top: 0, behavior: "smooth" });
  }, [listings]);

  return (
    <main className="flex flex-col md:flex-row p-2 mt-2 min-h-[calc(100vh-80px)]">
      <div
        style={{ transition: "height 0.5s, opacity 1s" }}
        className={clsx(
          "mx-2 rounded-lg bg-slate-200 md:h-fit text-slate-700 md:sticky md:top-[80px]",
          isMobileView
            ? showFilters
              ? "h-[375px] opacity-100"
              : "h-0 overflow-hidden opacity-0"
            : ""
        )}
      >
        <SearchFilters />
      </div>
      <div className="mt-2 md:mt-0 flex-1 md:border-l-2">
        <div className="bg-blend-saturation flex justify-between items-center p-2">
          <h1 className="text-3xl font-semibold border-b-2 border-slate-300 ml-2 pb-2 text-slate-700">
            Search Results:
          </h1>
          {isMobileView && (
            <button
              className="p-2 text-slate-700 flex items-center"
              onClick={() => setShowFilter(!showFilters)}
            >
              Filters{" "}
              {showFilters ? (
                <MdKeyboardDoubleArrowUp />
              ) : (
                <MdKeyboardDoubleArrowDown />
              )}
            </button>
          )}
        </div>
        <div className="p-7 flex flex-wrap gap-4">
          {!isLoading && listings && !listings.length && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {isLoading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}

          {!isLoading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
        </div>
      </div>
    </main>
  );
};

export default Search;
