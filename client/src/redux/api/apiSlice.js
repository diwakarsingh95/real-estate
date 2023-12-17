import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const listingsApi = createApi({
  reducerPath: "listings",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/listing" }),
  tagTypes: ["Listings"],
  endpoints: (builder) => ({
    getListings: builder.query({
      query: () => "",
      keepUnusedDataFor: 300,
      providesTags: ["Listings"],
      // providesTags: (result) =>
      //   result
      //     ? [...result.map(({ _id }) => ({ type: "Listings", id: _id }))]
      //     : [],
    }),
    createListing: builder.mutation({
      query: (body) => ({
        url: "create",
        method: "POST",
        body,
      }),
      async onQueryStarted({ userRef }, { dispatch, queryFulfilled }) {
        let updateResult;
        try {
          const { data: createdPost } = await queryFulfilled;
          updateResult = dispatch(
            listingsApi.util.updateQueryData(
              "getListings",
              userRef,
              (prevListings) => {
                prevListings.push(createdPost);
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
        } catch {
          console.log("Error...");
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
