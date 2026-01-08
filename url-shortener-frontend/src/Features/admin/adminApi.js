import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryWithAuth";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => "/admin/stats",
    }),
    getUsers: builder.query({
      query: () => "/admin/users",
    }),

    getUserProfile: builder.query({
      query: (userId) => `/admin/users/${userId}`,
    }),

    getUserUrls: builder.query({
      query: (userId) => `/admin/users/${userId}/urls`,
    }),
    getAllAdminUrls: builder.query({
      query: (params) => ({
        url: "/admin/urls",
        params,
      }),
      providesTags: ["AdminUrls"],
    }),

    getAbuseUrls: builder.query({
      query: () => "/admin/abuse",
    }),

    adminEnableUrl: builder.mutation({
      query: (id) => ({
        url: `/admin/url/${id}/enable`,
        method: "PATCH",
      }),
      invalidatesTags: ["AdminUrls"],
    }),

    adminDisableUrl: builder.mutation({
      query: (id) => ({
        url: `/admin/url/${id}/disable`,
        method: "PATCH",
      }),
      invalidatesTags: ["AdminUrls"],
    }),

    adminDeleteUrl: builder.mutation({
      query: (id) => ({
        url: `/admin/url/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminUrls"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserProfileQuery,
  useGetUserUrlsQuery,
  useGetAdminStatsQuery,
  useGetAllAdminUrlsQuery,
  useGetAbuseUrlsQuery,
  useAdminEnableUrlMutation,
  useAdminDisableUrlMutation,
  useAdminDeleteUrlMutation,
} = adminApi;
