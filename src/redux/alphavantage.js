import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const TOKEN = import.meta.env.VITE_ALPHAVANTAGE_API_KEY;

export const alphavantageAPI = createApi({
  reducerPath: "alphavantageAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.alphavantage.co/query",
  }),
  endpoints: (builder) => ({
    getDailyHistoricalData: builder.query({
      query: (symbol) =>
        `?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${TOKEN}`,
    }),
  }),
});

export const { useGetDailyHistoricalDataQuery } = alphavantageAPI;
