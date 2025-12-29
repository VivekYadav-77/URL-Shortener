import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const adminApi = createApi({
    reducerPath :"adminApi",
    baseQuery:fetchBaseQuery({
        baseUrl:"http://localhost:5000/api",
        credentials:"include",
    }),
    tagTypes:["AdminUrls"],
    endpoints:(builder)=>({
        getPlatformStats:builder.query({
            query:()=>"/admin/stats"
        }),
        getAllUrls:builder.query({
            query:()=> "/admin/urls",
            providesTags:["AdminUrls"]
        }),
        getAbusedUrls:builder.query({
            query:()=> "/admin/abuse",
            providesTags:["AdminUrls"]
        }),
        disableUrlByAdmin:builder.query({
            query:(id)=> ({
                url:`/admin/disable/${id}`,
                method:"PATCH",
            }),
            invalidatesTags:["AdminUrls"]
        })

    })
})
export const{useGetPlatformStatsQuery,useGetAllUrlsQuery, useGetAbusedUrlsQuery,useDisableUrlByAdminMutation} = adminApi