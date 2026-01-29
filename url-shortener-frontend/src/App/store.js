import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Features/auth/authSlice";
import { urlApi } from "../Features/urls/urlApi";
import { authApi } from "../Features/auth/authapi";
import { adminApi } from "../Features/admin/adminApi";
export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [urlApi.reducerPath]: urlApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      urlApi.middleware,
      adminApi.middleware,
    ),
});
