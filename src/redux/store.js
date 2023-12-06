import { configureStore } from "@reduxjs/toolkit";
import { finnhubApi } from "./finnhub";

export const store = configureStore({
  reducer: {
    [finnhubApi.reducerPath]: finnhubApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(finnhubApi.middleware),
});
