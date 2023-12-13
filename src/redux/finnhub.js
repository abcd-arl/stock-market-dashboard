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
    getPeers: builder.query({
      query: (params) =>
        `stock/peers?symbol=${params.symbol}&grouping=${params.grouping}&token=${TOKEN}`,
    }),
    getMarketNews: builder.query({
      query: () => `news?category=general&token=${TOKEN}`,
    }),
    getCompanyNews: builder.query({
      query: (param) =>
        `company-news?symbol=${param.symbol}&from=${param.from}&to=${param.to}&token=${TOKEN}`,
    }),
    getBasicFinancials: builder.query({
      query: (symbol) =>
        `stock/metric?symbol=${symbol}&metric=all&token=${TOKEN}`,
    }),
    getProfilesAndQuotes: builder.query({
      queryFn: async (arg, queryApi) => {
        const data = {};
        for (const symbol of arg) {
          const profile = await queryApi.dispatch(
            finnhubApi.endpoints.getProfile.initiate(symbol),
          );
          const quote = await queryApi.dispatch(
            finnhubApi.endpoints.getQuote.initiate(symbol),
          );

          if (profile?.error?.status === 429 || quote?.error?.status === 429)
            return { error: { status: 429 } };

          data[symbol] = {
            profile: profile.data,
            quote: quote.data,
          };
        }
        return { data };
      },
    }),
    getProfileAndQuote: builder.query({
      queryFn: async (arg, queryApi) => {
        const profile = await queryApi.dispatch(
          finnhubApi.endpoints.getProfile.initiate(arg),
        );
        const quote = await queryApi.dispatch(
          finnhubApi.endpoints.getQuote.initiate(arg),
        );

        return {
          data: {
            profile: profile.data ? profile.data : profile.error,
            quote: quote.data ? quote.data : quote.error,
          },
        };
      },
    }),
    getPeersProfilesAndQuotes: builder.query({
      queryFn: async (arg, queryApi) => {
        const peers = await queryApi.dispatch(
          finnhubApi.endpoints.getPeers.initiate({
            symbol: arg.symbol,
            grouping: arg.grouping,
          }),
        );

        const data = {};
        for (const symbol of peers.data) {
          const profile = await queryApi.dispatch(
            finnhubApi.endpoints.getProfile.initiate(symbol),
          );
          const quote = await queryApi.dispatch(
            finnhubApi.endpoints.getQuote.initiate(symbol),
          );

          if (profile.error || quote.error) continue;

          data[symbol] = {
            profile: profile.data,
            quote: quote.data,
          };
        }
        return { data };
      },
    }),
  }),
});

export const {
  useGetProfilesAndQuotesQuery,
  useLazyGetProfilesAndQuotesQuery,
  useGetProfileAndQuoteQuery,
  useGetMarketNewsQuery,
  useGetCompanyNewsQuery,
  useGetBasicFinancialsQuery,
  useGetPeersProfilesAndQuotesQuery,
  useGetProfileQuery,
  useGetPeersQuery,
} = finnhubApi;
