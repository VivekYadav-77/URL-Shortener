import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryWithAuth";
export const adminApi = createApi({
    reducerPath :"adminApi",
    baseQuery:baseQueryWithAuth,
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