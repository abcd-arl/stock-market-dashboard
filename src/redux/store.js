import { configureStore } from "@reduxjs/toolkit";
import { finnhubApi } from "./finnhub";
import { alphavantageAPI } from "./alphavantage";

export const store = configureStore({
  reducer: {
    [finnhubApi.reducerPath]: finnhubApi.reducer,
    [alphavantageAPI.reducerPath]: alphavantageAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      finnhubApi.middleware,
      alphavantageAPI.middleware,
    ),
});
