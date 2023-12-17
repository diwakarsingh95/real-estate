import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const listingsApi = createApi({
  reducerPath: "listings",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  endpoints: (builder) => ({
    getListings: builder.query({
      query: () => `listing`,
    }),
  }),
});

export const { useGetListingsQuery } = listingsApi;
