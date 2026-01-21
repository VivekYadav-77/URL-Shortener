import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryWithAuth";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["AdminUrls", "Users", "UserProfile", "UserUrls", "Abuse"],

  endpoints: (builder) => ({

    getAdminStats: builder.query({
      query: () => "/admin/stats",
      keepUnusedDataFor: 600,
    }),

    getUsers: builder.query({
      query: () => "/admin/users",
      providesTags: ["Users"],
      keepUnusedDataFor: 300,
    }),

    getUserProfile: builder.query({
      query: (userId) => `/admin/users/${userId}`,
      providesTags: (r, e, id) => [{ type: "UserProfile", id }],
      keepUnusedDataFor: 300,
    }),

    getUserUrls: builder.query({
      query: (userId) => `/admin/users/${userId}/urls`,
      providesTags: (r, e, id) => [{ type: "UserUrls", id }],
      keepUnusedDataFor: 300,
    }),

    getAllAdminUrls: builder.query({
      query: (params) => ({
        url: "/admin/urls",
        params,
      }),
      providesTags: ["AdminUrls"],
      keepUnusedDataFor: 240,
    }),

    getAbuseUrls: builder.query({
      query: () => `/admin/abuse`,
      providesTags: ["Abuse"],
      keepUnusedDataFor: 120,
    }),

    adminEnableUrl: builder.mutation({
      query: (id) => ({
        url: `/admin/url/${id}/enable`,
        method: "PATCH",
      }),
      invalidatesTags: ["AdminUrls", "Abuse"]
    }),

    adminDisableUrl: builder.mutation({
      query: (id) => ({
        url: `/admin/url/${id}/disable`,
        method: "PATCH",
      }),
      invalidatesTags: ["AdminUrls", "Abuse"]
    }),

    adminDeleteUrl: builder.mutation({
      query: (id) => ({
        url: `/admin/url/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminUrls", "Abuse"]
    }),
    getSecurityLogs: builder.query({
      query: () => "/admin/logs",
      providesTags: ["SecurityLogs"],
      keepUnusedDataFor: 300,
    }),

    getHighRiskLogs: builder.query({
      query: () => "/admin/high-risk",
      providesTags: ["HighRiskLogs"],
      keepUnusedDataFor: 300,
    }),

    deleteSecurityLogs: builder.mutation({
      query: () => ({
        url: "/admin/deleteLogs",
        method: "DELETE",
      }),
      invalidatesTags: ["SecurityLogs", "HighRiskLogs"],
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
  useGetSecurityLogsQuery,
  useGetHighRiskLogsQuery,
  useDeleteSecurityLogsMutation
} = adminApi;
