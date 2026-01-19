import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryWithAuth";

export const urlApi = createApi({
  reducerPath: "urlApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Urls", "UrlStats", "History"],

  endpoints: (builder) => ({
    
    getMyUrls: builder.query({
      query: () => "/urls/my",
      providesTags: ["Urls"],
      keepUnusedDataFor: 240,
    }),

    getUrlStats: builder.query({
      query: (id) => `/urls/${id}/stats`,
      providesTags: (result, error, id) => [
        { type: "UrlStats", id }
      ],
      keepUnusedDataFor: 300,
    }),

    createUrl: builder.mutation({
      query: (data) => ({
        url: "/urls",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Urls"],
    }),

    updateUrl: builder.mutation({
      query: ({ id, data }) => ({
        url: `/urls/${id}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (result, error, { id }) => [
        "Urls",
        { type: "UrlStats", id }
      ],
    }),

    deleteUrl: builder.mutation({
      query: (id) => ({
        url: `/urls/${id}`,
        method: "DELETE",
      }),

      // FIXED HERE
      invalidatesTags: (result, error, id) => [
        "Urls",
        { type: "UrlStats", id }
      ],
    }),

    getHistoryUrls: builder.query({
      query: () => "/urls/history",
      providesTags: ["History"],
      keepUnusedDataFor: 600,
    }),

  }),
});

export const {
  useGetMyUrlsQuery,
  useCreateUrlMutation,
  useUpdateUrlMutation,
  useDeleteUrlMutation,
  useGetUrlStatsQuery,
  useGetHistoryUrlsQuery,
} = urlApi;
