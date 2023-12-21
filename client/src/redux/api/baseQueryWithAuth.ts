import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery
} from "@reduxjs/toolkit/query";
import { signOutUserSuccess } from "../user/userSlice";

const baseQueryWithAuth = ({ baseUrl }: { baseUrl: string }) => {
  const baseQuery = fetchBaseQuery({ baseUrl });

  const baseQueryOverride: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
      api.dispatch(signOutUserSuccess());
      window?.location.replace("/sign-in");
    }
    return result;
  };

  return baseQueryOverride;
};

export default baseQueryWithAuth;
