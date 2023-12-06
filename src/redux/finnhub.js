import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const TOKEN = import.meta.env.VITE_FINNHUB_API_KEY;

export const finnhubApi = createApi({
  reducerPath: "finnhubApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://finnhub.io/api/v1/",
  }),
  endpoints: (builder) => ({
    getQuote: builder.query({
      query: (symbol) => `quote?symbol=${symbol}&token=${TOKEN}`,
    }),
    getProfile: builder.query({
      query: (symbol) => `stock/profile2?symbol=${symbol}&token=${TOKEN}`,
    }),
    getMarketNews: builder.query({
      query: () => `news?category=general&token=${TOKEN}`,
    }),
    getProfileAndQuote: builder.query({
      queryFn: async (arg, queryApi) => {
        const data = {};
        for (const symbol of arg) {
          const profile = await queryApi.dispatch(
            finnhubApi.endpoints.getProfile.initiate(symbol)
          );
          const quote = await queryApi.dispatch(
            finnhubApi.endpoints.getQuote.initiate(symbol)
          );

          data[symbol] = {
            profile: profile.data ? profile.data : profile.error,
            quote: quote.data ? quote.data : quote.error,
          };
        }
        return { data };
      },
    }),
    getQuotes: builder.query({
      queryFn: async (arg, queryApi) => {
        const quotes = {};
        for (const symbol of arg) {
          const result = await queryApi.dispatch(
            finnhubApi.endpoints.getQuote.initiate(symbol)
          );
          quotes[symbol] = result.data ? result.data : result.error;
        }
        return { data: quotes };
      },
    }),
  }),
});

export const {
  useGetProfileAndQuoteQuery,
  useLazyGetProfileAndQuoteQuery,
  useGetMarketNewsQuery,
} = finnhubApi;
