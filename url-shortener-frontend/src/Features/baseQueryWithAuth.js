import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearUser } from "./auth/authSlice";
const API_BASE_URL = import.meta.env.VITE_B_LOCATION;
const baseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL}/api`,
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
        extraOptions,
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
