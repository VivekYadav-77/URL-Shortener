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
      query: () => "/urls",
      providesTags: ["Urls"]
    }),

    createUrl: builder.mutation({
      query: (data) => ({
        url: "/urls",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Urls"] 
    })
  })
});

export const {
  useGetMyUrlsQuery,
  useCreateUrlMutation
} = urlApi;
