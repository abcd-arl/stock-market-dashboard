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
    getCompanyNews: builder.query({
      query: (params) =>
        `company-news?symbol=${params.symbol}&from=${params.from}&to=${params.to}&token=${TOKEN}`,
    }),
    getBasicFinancials: builder.query({
      query: (symbol) =>
        `stock/metric?symbol=${symbol}&metric=all&token=${TOKEN}`,
    }),
    getPeers: builder.query({
      query: (params) =>
        `stock/peers?symbol=${params.symbol}&grouping=${params.grouping}&token=${TOKEN}`,
    }),
    getProfiles: builder.query({
      queryFn: async (arg, queryApi) => {
        const symbols = arg;
        const available = {};
        const unavailable = {};

        for (const symbol of symbols) {
          const profile = await queryApi.dispatch(
            finnhubApi.endpoints.getProfile.initiate(symbol),
          );

          if (profile?.isError) {
            if (profile.error.status === 429) {
              return { error: profile.error };
            }
            unavailable[symbol] = profile.error;
            continue;
          }

          available[symbol] = profile.data;
        }

        const profiles = {
          available,
          unavailable,
        };

        return { data: profiles };
      },
    }),
    getProfileAndQuote: builder.query({
      queryFn: async (arg, queryApi) => {
        const symbol = arg;

        const profile = await queryApi.dispatch(
          finnhubApi.endpoints.getProfile.initiate(symbol),
        );

        if (profile?.error?.status === 429 || profile?.error?.status === 403) {
          return { error: profile.error };
        }
        if (Object.keys(profile.data).length === 0) {
          return {
            error: { status: 404, data: { error: "Symbol not found." } },
          };
        }

        const quote = await queryApi.dispatch(
          finnhubApi.endpoints.getQuote.initiate(symbol),
        );

        if (quote?.error?.status === 429) {
          return { error: quote.error };
        }
        if (quote.data.c === 0) {
          return {
            error: { status: 404, data: { error: "Symbol not found." } },
          };
        }

        const profileAndQuote = {
          profile: profile.data,
          quote: quote.data,
        };

        return {
          data: profileAndQuote,
        };
      },
      refetchOnMountOrArgChange: true,
    }),
    getProfilesAndQuotes: builder.query({
      queryFn: async (arg, queryApi) => {
        const symbols = arg;
        const available = {};
        const unavailable = {};

        for (const symbol of symbols) {
          const profileAndQuote = await queryApi.dispatch(
            finnhubApi.endpoints.getProfileAndQuote.initiate(symbol),
          );

          if (profileAndQuote?.isError) {
            if (profileAndQuote.error.status === 429) {
              return { error: profileAndQuote.error };
            }
            unavailable[symbol] = profileAndQuote.error;
            continue;
          }

          available[symbol] = profileAndQuote.data;
        }

        const profilesAndQuotes = {
          available,
          unavailable,
        };

        return { data: profilesAndQuotes };
      },
      refetchOnMountOrArgChange: true,
    }),
    getProfilesAndQuotesWithLimit: builder.query({
      queryFn: async (args, queryApi) => {
        const { peers, limit } = args;
        const available = {};
        const unavailable = {};

        for (const peer of peers) {
          const profileAndQuote = await queryApi.dispatch(
            finnhubApi.endpoints.getProfileAndQuote.initiate(peer),
          );

          if (profileAndQuote?.isError) {
            if (profileAndQuote.error.status === 429) {
              return { error: profileAndQuote.error };
            }
            unavailable[peer] = profileAndQuote.error;
            continue;
          }

          available[peer] = profileAndQuote.data;
          if (Object.keys(available).length === limit) {
            break;
          }
        }

        const profilesAndQuotes = {
          available,
          unavailable,
        };

        return { data: profilesAndQuotes };
      },
      refetchOnMountOrArgChange: true,
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetProfilesQuery,
  useGetMarketNewsQuery,
  useGetCompanyNewsQuery,
  useGetBasicFinancialsQuery,
  useGetPeersQuery,
  useGetProfileAndQuoteQuery,
  useGetProfilesAndQuotesQuery,
  useLazyGetProfileAndQuoteQuery,
  useLazyGetProfilesAndQuotesQuery,
  useLazyGetProfilesAndQuotesWithLimitQuery,
} = finnhubApi;
