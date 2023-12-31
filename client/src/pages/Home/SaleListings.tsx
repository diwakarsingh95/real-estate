import { Link } from "react-router-dom";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import ListingItem from "../../components/ListingItem";
import { useGetListingsQuery } from "../../redux/api/apiSlice";

const SaleListings = () => {
  SwiperCore.use([Navigation]);
  const { data } = useGetListingsQuery("type=sale");

  const listings = data && data.listings;
  const listingsCount = listings ? listings.length : 0;

  const swiperBreakpoints = {
    640: {
      slidesPerView: listingsCount > 1 ? 2 : 1
    },
    768: {
      slidesPerView: listingsCount > 2 ? 3 : listingsCount > 1 ? 2 : 1
    },
    1024: {
      slidesPerView:
        listingsCount > 3
          ? 4
          : listingsCount > 2
            ? 3
            : listingsCount > 1
              ? 2
              : 1
    }
  };

  return (
    <section>
      {listings && !!listings.length && (
        <div className="">
          <div className="my-3">
            <h2 className="text-2xl font-semibold text-slate-600">
              Recent places for Sale
            </h2>
            <Link
              className="text-sm text-blue-800 hover:underline"
              to={"/search?type=sale"}
            >
              Show more places for sale
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            <Swiper
              navigation
              slidesPerView={1}
              spaceBetween={10}
              breakpoints={swiperBreakpoints}
              loop
            >
              {listings.map((listing) => (
                <SwiperSlide>
                  <ListingItem listing={listing} key={listing._id} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </section>
  );
};

export default SaleListings;
