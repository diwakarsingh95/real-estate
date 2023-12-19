import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Listing } from "../../services/types";

export const listingsApi = createApi({
  reducerPath: "listings",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/listing" }),
  tagTypes: ["Listings"],
  endpoints: (builder) => ({
    getListings: builder.query<Listing[], string>({
      query: () => "",
      keepUnusedDataFor: 300,
      providesTags: ["Listings"],
      // providesTags: (result) =>
      //   result
      //     ? [...result.map(({ _id }) => ({ type: "Listings", id: _id }))]
      //     : [],
    }),
    createListing: builder.mutation<Listing, Partial<Listing>>({
      query: (body) => ({
        url: "create",
        method: "POST",
        body,
      }),
      async onQueryStarted({ userRef }, { dispatch, queryFulfilled }) {
        let updateResult;
        try {
          const { data: createdListing } = await queryFulfilled;
          updateResult = dispatch(
            listingsApi.util.updateQueryData(
              "getListings",
              userRef as string,
              (prevListings) => {
                prevListings.push(createdListing);
              }
            )
          );
        } catch {
          if (updateResult) updateResult.undo();
        }
      },
    }),
    deleteListing: builder.mutation({
      query(id) {
        return {
          url: `/delete/${id}`,
          method: "DELETE",
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: deletedListing } = await queryFulfilled;
          dispatch(
            listingsApi.util.updateQueryData(
              "getListings",
              deletedListing.userRef,
              (prevListings) => {
                prevListings.splice(
                  prevListings.findIndex((e) => e._id === deletedListing._id),
                  1
                );
              }
            )
          );
        } catch (err) {
          console.error("Listing delete Error...", err);
        }
      },
      // invalidatesTags: (result, error, id) => [{ type: 'Listings', id }],
    }),
  }),
});

export const {
  useGetListingsQuery,
  useCreateListingMutation,
  useDeleteListingMutation,
} = listingsApi;
