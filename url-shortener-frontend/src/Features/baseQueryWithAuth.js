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
    typeof args === "string" ? args : args?.url || "";

  const isAuthRoute = url.startsWith("/auth/");

  // 🟡 HANDLE SERVER DOWN (COLD START)
  if (result.error?.status === "FETCH_ERROR") {
    console.warn("Server waking up... retrying");

    await new Promise((res) => setTimeout(res, 3000));

    return await baseQuery(args, api, extraOptions);
  }

  // 🔴 HANDLE AUTH FAILURE ONLY
  if (result.error?.status === 401 && !isAuthRoute) {
    if (!isRefreshing) {
      isRefreshing = true;

      refreshPromise = baseQuery(
        { url: "/auth/refresh", method: "POST" },
        api,
        extraOptions
      )
        .then((res) => {
          // ❗ ONLY logout if truly unauthorized
          if (res.error?.status === 401) {
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