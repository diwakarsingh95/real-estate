import { useState } from "react";
import { useParams } from "react-router-dom";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare
} from "react-icons/fa";
import { useGetListingQuery } from "../../redux/api/apiSlice";
import { getErrorMessage } from "../../utils/helpers";
import { useAppSelector } from "../../hooks";
import ListingContactForm from "./ListingContactForm";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const { id } = useParams();
  const { currentUser } = useAppSelector((state) => state.user);
  const {
    data: listing,
    error,
    isLoading
  } = useGetListingQuery(id as string, {
    skip: !id
  });
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const listingOwner = listing?.userRef;

  return (
    <>
      {isLoading && (
        <p className="text-center text-gray-600 text-2xl my-10">Loading...</p>
      )}
      {error && (
        <p className="text-center text-gray-600 text-2xl my-10">
          {getErrorMessage(error)}
        </p>
      )}
      {listing && !isLoading && !error && (
        <>
          <Swiper navigation loop>
            {listing.imageUrls.map((url, index) => (
              <SwiperSlide key={url.slice(-10) + index}>
                <div
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover"
                  }}
                  className="h-[300px] sm:h-[550px]"
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[100px] right-[25px] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 500);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[145px] right-[75px] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / Month"}
            </p>
            <p className="flex items-center gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountPrice}
                </p>
              )}
            </div>
            <p className="text-slate-800">{listing.description}</p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {currentUser &&
              listingOwner &&
              listingOwner._id &&
              listingOwner._id !== currentUser._id &&
              !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
                >
                  Contact landlord
                </button>
              )}
            {contact && listingOwner && (
              <ListingContactForm
                listingName={listing.name}
                owner={listingOwner}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Listing;
