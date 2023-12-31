import { Link } from "react-router-dom";
import SaleListings from "./SaleListings";
import RentListings from "./RentListings";
import LatestListings from "./LatestListings";

const Home = () => {
  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Real Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's get started...
        </Link>
      </div>

      <LatestListings />

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        <SaleListings />
        <RentListings />
      </div>
    </div>
  );
};

export default Home;
