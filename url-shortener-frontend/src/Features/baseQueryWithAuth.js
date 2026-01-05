import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearUser } from "./auth/authSlice";
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api",
  credentials: "include",
});
let isRefreshing = false;

export const baseQueryWithAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;

      const refreshResult = await baseQuery(
        { url: "/auth/refresh", method: "POST" },
        api,
        extraOptions
      );

      isRefreshing = false;

      if (refreshResult.data) {
        return await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(clearUser());
      }
    }
  }
  return result;
};
