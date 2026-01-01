import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearUser } from "./auth/authSlice";
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api",
  credentials: "include",
});

export const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(clearUser());

    window.location.href = "/login";
  }

  return result;
};
