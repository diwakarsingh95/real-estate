import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { useGetListingsQuery } from "../../redux/api/apiSlice";

const LatestListings = () => {
  SwiperCore.use([Navigation]);
  const { data } = useGetListingsQuery("limit=5");

  const listings = data && data.listings;

  return (
    <Swiper navigation>
      {listings &&
        !!listings.length &&
        listings.map((listing) => (
          <SwiperSlide>
            <div
              style={{
                background: `url(${listing.imageUrls[0]}) center no-repeat`,
                backgroundSize: "cover"
              }}
              className="h-[500px]"
              key={listing._id}
            ></div>
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default LatestListings;
