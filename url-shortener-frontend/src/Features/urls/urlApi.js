import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const urlApi = createApi({
  reducerPath: "urlApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include"
  }),
  tagTypes: ["Urls"],
  endpoints: (builder) => ({
    getMyUrls: builder.query({
      query: () => "/urls/my",
      providesTags: ["Urls"]
    }),
getUrlStats: builder.query({
  query: (id) => `/urls/${id}/stats`
}),
    createUrl: builder.mutation({
      query: (data) => ({
        url: "/urls",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Urls"]
    }),

    updateUrl: builder.mutation({
      query: ({ id, data }) => ({
        url: `/urls/${id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["Urls"]
    }),

    deleteUrl: builder.mutation({
      query: (id) => ({
        url: `/urls/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Urls"]
    })
  })
});

export const {
  useGetMyUrlsQuery,
  useCreateUrlMutation,
  useUpdateUrlMutation,
  useDeleteUrlMutation,
  useGetUrlStatsQuery,
} = urlApi;
