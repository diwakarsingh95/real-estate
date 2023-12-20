import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAppSelector } from "../hooks";

const Header = () => {
  const { currentUser } = useAppSelector((state) => state.user);

  return (
    <header className="bg-slate-200 shadow-md fixed w-full top-0 z-10">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Real</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="search"
            placeholder="Search..."
            name="search"
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
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
