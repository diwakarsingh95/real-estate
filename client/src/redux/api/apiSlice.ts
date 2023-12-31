import { createApi } from "@reduxjs/toolkit/query/react";
import { Listing, ListingsResponse } from "../../utils/types";
import baseQueryWithAuth from "./baseQueryWithAuth";

export const listingsApi = createApi({
  reducerPath: "listings",
  baseQuery: baseQueryWithAuth({ baseUrl: "/api/listing" }),
  keepUnusedDataFor: 0,
  tagTypes: ["Listings"],
  invalidationBehavior: "immediately",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getListings: builder.query<ListingsResponse, string>({
      query: (queryParams) => `/?${queryParams}`,
      providesTags: (result) =>
        result
          ? [
              ...result.listings.map(
                ({ _id }) => ({ type: "Listings", id: _id }) as const
              ),
              { type: "Listings", id: "LIST" }
            ]
          : [{ type: "Listings", id: "LIST" }]
    }),
    getListing: builder.query<Listing, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Listings", id }]
    }),
    getUserListings: builder.query<Listing[], void>({
      query: () => `/userListings`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ _id }) => ({ type: "Listings", id: _id }) as const
              )
            ]
          : []
    }),
    createListing: builder.mutation<Listing, Partial<Listing>>({
      query: (body) => ({
        url: "/create",
        method: "POST",
        body
      }),
      invalidatesTags: [{ type: "Listings", id: "LIST" }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        let updateResult;
        try {
          const { data: createdListing } = await queryFulfilled;
          updateResult = dispatch(
            listingsApi.util.updateQueryData(
              "getListings",
              "",
              (prevListings) => {
                prevListings.listings.push(createdListing);
              }
            )
          );
        } catch {
          if (updateResult) updateResult.undo();
        }
      }
    }),
    updateListing: builder.mutation<Listing, Partial<Listing>>({
      query: ({ _id, ...body }) => ({
        url: `/update/${_id}`,
        method: "POST",
        body
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        let patchResult;
        try {
          const { data: updatedListing } = await queryFulfilled;
          patchResult = dispatch(
            listingsApi.util.updateQueryData(
              "getListings",
              "",
              (prevListings) => {
                const index = prevListings.listings.findIndex(
                  (e) => e._id === updatedListing._id
                );
                prevListings.listings.splice(index, 1, updatedListing);
              }
            )
          );
        } catch {
          if (patchResult) patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, { _id }) => [
        { type: "Listings", id: _id }
      ]
    }),
    deleteListing: builder.mutation({
      query(id) {
        return {
          url: `/delete/${id}`,
          method: "DELETE"
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
                prevListings.listings.splice(
                  prevListings.listings.findIndex(
                    (e) => e._id === deletedListing._id
                  ),
                  1
                );
              }
            )
          );
        } catch (err) {
          console.error("Listing delete Error...", err);
        }
      },
      invalidatesTags: (_result, _error, id) => [{ type: "Listings", id }]
    }),
    searchListings: builder.query<ListingsResponse, string>({
      query: (searchParams) => `/search?${searchParams}`
    })
  })
});

export const {
  useGetListingsQuery,
  useGetListingQuery,
  useCreateListingMutation,
  useDeleteListingMutation,
  useUpdateListingMutation,
  useGetUserListingsQuery,
  useSearchListingsQuery
} = listingsApi;
