import React from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams
} from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useAppSelector } from "../hooks";

const Header = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { search } = e.currentTarget;
    const { value } = search;

    searchParams.set("q", value);
    setSearchParams(searchParams);

    if (pathname !== "/search") navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <header className="bg-slate-200 shadow-md fixed w-full top-0 z-10">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Real</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSearchSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="search"
            placeholder="Search..."
            name="search"
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            defaultValue={searchQuery || ""}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          <li className="hidden sm:inline text-slate-700 hover:underline">
            <Link to="/">Home</Link>
          </li>
          <li className="hidden sm:inline text-slate-700 hover:underline">
            <Link to="/about">About</Link>
          </li>
          <li className="text-slate-700 hover:underline">
            <Link to={currentUser ? "/profile" : "/sign-in"}>
              {currentUser ? (
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={currentUser.avatar}
                  alt="Profile"
                />
              ) : (
                "Sign in"
              )}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
