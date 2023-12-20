import { useParams } from "react-router-dom";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { useGetListingQuery } from "../../redux/api/apiSlice";
import { getErrorMessage } from "../../services/helpers";

const Listing = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useGetListingQuery(id as string, {
    skip: !id
  });

  SwiperCore.use([Navigation]);

  return (
    <main>
      {isLoading && (
        <p className="text-center text-gray-600 text-2xl my-10">Loading...</p>
      )}
      {error && (
        <p className="text-center text-gray-600 text-2xl my-10">
          {getErrorMessage(error)}
        </p>
      )}
      {data && !isLoading && !error && (
        <>
          <Swiper navigation>
            {data.imageUrls.map((url, index) => (
              <SwiperSlide key={url.slice(-10) + index}>
                <div
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover"
                  }}
                  className="h-[550px]"
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </main>
  );
};

export default Listing;
