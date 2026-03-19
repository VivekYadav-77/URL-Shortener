import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearUser } from "./auth/authSlice";
const API_BASE_URL = import.meta.env.VITE_B_LOCATION;
const baseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL}/api`,
  credentials: "include",
});
let isRefreshing = false;
let refreshPromise = null;

export const baseQueryWithAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  const url =
    typeof args === "string"
      ? args
      : args?.url || "";

  const isAuthRoute = url.startsWith("/auth/");


  if (result.error?.status === 401 && !isAuthRoute) {
    if (!isRefreshing) {
      isRefreshing = true;

      refreshPromise = baseQuery(
        { url: "/auth/refresh", method: "POST" },
        api,
        extraOptions
      )
        .then((res) => {
          if (!res.data) {
            api.dispatch(clearUser());
          }
          return res;
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    const refreshResult = await refreshPromise;

    if (refreshResult?.data) {
      return await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};