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

          if (Object.keys(profile.data).length === 0 && quote.c === 0) continue;

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
      queryFn: async (args, queryApi) => {
        const { symbol, peers, limit } = args;

        const data = {
          peers: {},
          unavailablePeers: [],
        };
        for (const peer of peers) {
          if (peer === symbol) {
            data.unavailablePeers.push(peer);
            continue;
          }

          const profile = await queryApi.dispatch(
            finnhubApi.endpoints.getProfile.initiate(peer),
          );
          const quote = await queryApi.dispatch(
            finnhubApi.endpoints.getQuote.initiate(peer),
          );

          if (profile?.error?.status === 429 || quote?.error?.status === 429)
            return { error: { status: 429 } };

          if (Object.keys(profile.data).length === 0 || quote.data.c === 0) {
            data.unavailablePeers.push(peer);
            continue;
          }

          data.peers[peer] = {
            profile: profile.data,
            quote: quote.data,
          };

          if (Object.keys(data.peers).length === limit) break;
        }

        return { data };
      },
    }),
  }),
});

export const {
  useGetPeersQuery,
  useGetProfilesAndQuotesQuery,
  useLazyGetProfilesAndQuotesQuery,
  useGetProfileAndQuoteQuery,
  useGetMarketNewsQuery,
  useGetCompanyNewsQuery,
  useGetBasicFinancialsQuery,
  useLazyGetPeersProfilesAndQuotesQuery,
  useGetProfileQuery,
} = finnhubApi;
