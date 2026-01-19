import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryWithAuth";
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["User"],
  
  endpoints: (builder) => ({

    getMe: builder.query({
      query: () => "/users/me",
      providesTags: ["User"],
      keepUnusedDataFor: 300,
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"]
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"]
    }),

    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    updateMe: builder.mutation({
      query: (data) => ({
        url: "/users/me",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"]
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/users/me/password",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"]
    }),

  }),
});


export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLogoutMutation,
  useUpdateMeMutation,
  useChangePasswordMutation,
} = authApi;
