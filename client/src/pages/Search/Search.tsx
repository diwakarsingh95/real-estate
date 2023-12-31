import { useState } from "react";
import clsx from "clsx";
import {
  MdKeyboardDoubleArrowUp,
  MdKeyboardDoubleArrowDown
} from "react-icons/md";
import SearchFilters from "./SearchFilters";
import useWindowSize from "../../hooks/useWindowSize";

const Search = () => {
  const { width: windowWidth } = useWindowSize();
  const [showFilters, setShowFilter] = useState(false);

  const isMobileView = windowWidth < 768;

  return (
    <main className="flex flex-col md:flex-row p-2">
      <div
        style={{ transition: "height 0.5s, opacity 1s" }}
        className={clsx(
          "md:border-r-2 md:min-h-screen text-slate-700",
          isMobileView
            ? showFilters
              ? "h-[375px] opacity-100"
              : "h-0 overflow-hidden opacity-0"
            : ""
        )}
      >
        <SearchFilters />
      </div>
      <div className="mt-2">
        <div className="flex justify-between items-center p-2">
          <h1 className="text-3xl font-semibold border-b pb-2 text-slate-700">
            Listing results:
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
      </div>
    </main>
  );
};

export default Search;
