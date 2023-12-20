import { useEffect } from "react";
import { Link } from "wouter";
import useWebSocket from "react-use-websocket";
import { useGetProfilesAndQuotesQuery } from "../redux/finnhub";
import { formatMarketCap } from "../utils/format";
import { SOCKET_URL } from "../App";
import SkeletonLoading from "./skeletonLoading";

export default function TricketTable({ title, symbols }) {
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    SOCKET_URL,
    { share: true },
  );
  const {
    data: profilesAndQuotes,
    isLoading: profilesAndQuotesIsLoading,
    isSuccess: profilesAndQuotesIsSuccess,
    isError: profilesAndQuotesIsError,
    error: profilesAndQuotesError,
    refetch: refetchProfilesAndQuotes,
  } = useGetProfilesAndQuotesQuery(symbols);

  useEffect(() => {
    if (profilesAndQuotesIsSuccess && readyState === 1) {
      const symbols = Object.keys(profilesAndQuotes.available);
      for (const symbol of symbols) {
        sendJsonMessage({ type: "subscribe", symbol });
      }
    }
  }, [profilesAndQuotesIsSuccess, readyState]);

  let content;
  if (profilesAndQuotesIsLoading) {
    content = Array(5)
      .fill()
      .map((_, index) => (
        <tr
          key={index}
          className="rounded-full border-y border-gray-100 text-right font-mono last:border-0 hover:bg-gray-50"
        >
          <td className="flex items-center py-2 pl-3 text-left font-sans xl:pl-5">
            <div className="h-6 basis-6">
              <SkeletonLoading className="mr-2 h-6 w-6 rounded-full" />
            </div>

            <div className="flex gap-2">
              <SkeletonLoading className="h-2 w-8" />
              <SkeletonLoading className="hidden h-2 w-32 2xl:block" />
            </div>
          </td>
          <td>
            <SkeletonLoading className="ml-auto h-2 w-16" />
          </td>
          <td>
            <SkeletonLoading className="ml-auto h-2 w-16" />
          </td>
          <td className="pr-3 sm:pr-0">
            <SkeletonLoading className="ml-auto h-2 w-16" />
          </td>
          <td className="hidden sm:table-cell sm:pr-0 md:pr-0 lg:pr-0">
            <SkeletonLoading className="ml-auto h-2 w-16" />
          </td>
          <td className="hidden sm:table-cell sm:pr-3 md:pr-0 lg:pr-0">
            <SkeletonLoading className="ml-auto h-2 w-16" />
          </td>
          <td className="hidden md:table-cell md:pr-0 lg:hidden xl:table-cell">
            <SkeletonLoading className="ml-auto h-2 w-16" />
          </td>
          <td className="hidden md:table-cell md:pr-3 lg:hidden xl:table-cell">
            <SkeletonLoading className="ml-auto h-2 w-16" />
          </td>
          <td className="hidden lg:table-cell lg:pr-3 xl:pr-5 2xl:pr-0">
            <SkeletonLoading className="ml-auto h-2 w-16" />
          </td>
          <td className="hidden pl-7 pr-5 font-sans 2xl:table-cell 2xl:pr-5">
            <SkeletonLoading className="h-2 w-24" />
          </td>
        </tr>
      ));
  } else if (profilesAndQuotesIsSuccess) {
    content = Object.keys(profilesAndQuotes.available).map((symbol) => {
      const name = profilesAndQuotes.available[symbol].profile.name;
      const logo = profilesAndQuotes.available[symbol].profile.logo;

      const high = profilesAndQuotes.available[symbol].quote.h.toFixed(3);
      const low = profilesAndQuotes.available[symbol].quote.l.toFixed(3);
      const open = profilesAndQuotes.available[symbol].quote.o.toFixed(3);
      const close = profilesAndQuotes.available[symbol].quote.pc.toFixed(3);

      let current = profilesAndQuotes.available[symbol].quote.c.toFixed(3);

      if (lastJsonMessage?.type === "trade") {
        const trade = lastJsonMessage.data.find((trade) => trade.s === symbol);
        if (trade) {
          current = trade.p.toFixed(3);
        }
      }

      const change = (current - close).toFixed(3);
      const percentChange = ((change / close) * 100).toFixed(3);

      const marketCap = formatMarketCap(
        profilesAndQuotes.available[symbol].profile.marketCapitalization,
      );
      const industry =
        profilesAndQuotes.available[symbol].profile.finnhubIndustry;

      return (
        <tr
          key={symbol}
          className="rounded-full border-y border-gray-100 text-right font-mono last:border-0 hover:bg-gray-50"
        >
          <td className="py-2 pl-3 text-left font-sans xl:pl-5">
            <Link to={`/profile/${symbol}`} className="flex items-center">
              <div className="mr-2 h-6 shrink-0 basis-6 rounded-full bg-gray-200">
                <img src={logo} alt={name} className="h-6 w-6 rounded-full" />
              </div>
              <div className="flex w-full gap-2">
                <h3 className="font-bold">{symbol}</h3>
                <p className="hidden w-full overflow-hidden overflow-ellipsis whitespace-nowrap 2xl:block 2xl:w-40">
                  {name}
                </p>
              </div>
            </Link>
          </td>
          <td>
            <span
              key={"current" + change}
              className="ml-auto w-fit animate-fade-in"
            >
              {current}
            </span>
          </td>
          <td
            className={`sm:pr-0 ${
              change < 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {change > 0 ? "+" : ""}
            {change}
          </td>
          <td
            className={`pr-3 sm:pr-0 ${
              percentChange < 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {change > 0 ? "+" : ""}
            {percentChange}
          </td>
          <td className="hidden sm:table-cell sm:pr-0 md:pr-0 lg:pr-0">
            {high}
          </td>
          <td className="hidden sm:table-cell sm:pr-3 md:pr-0 lg:pr-0">
            {low}
          </td>
          <td className="hidden md:table-cell md:pr-0 lg:hidden xl:table-cell">
            {open}
          </td>
          <td className="hidden md:table-cell md:pr-3 lg:hidden xl:table-cell">
            {close}
          </td>
          <td className="hidden lg:table-cell lg:pr-3 xl:pr-5 2xl:pr-0">
            {marketCap}
          </td>
          <td className="hidden pl-7 pr-5 text-left font-sans 2xl:table-cell 2xl:pr-5">
            {industry}
          </td>
        </tr>
      );
    });
  }

  return (
    <div className="w-full overflow-auto rounded-md border border-gray-300 px-2 py-6 shadow">
      <h2 className="mb-1 pl-3 text-2xl font-bold xl:pl-5">{title}</h2>{" "}
      {profilesAndQuotesIsError && profilesAndQuotesError.status === 429 ? (
        <div className="flex h-60 flex-col items-center justify-center p-2 text-sm">
          <p className="text-center">
            You have reached the maximum API call limit. Please try again after
            a minute. Click{" "}
            <span
              className="cursor-pointer text-blue-500"
              onClick={refetchProfilesAndQuotes}
            >
              here
            </span>{" "}
            to refetch.
          </p>
        </div>
      ) : (
        <table className="w-full table-fixed border-collapse overflow-ellipsis text-right text-sm">
          <colgroup>
            <col className="w-[5.5rem] 2xl:w-48" />
            <col className="w-[5.5rem]" />
            <col className="w-[5.5rem]" />
            <col className="w-[5.5rem]" />
            <col className="hidden w-[5.5rem] sm:table-column sm:pr-0 md:pr-0 lg:pr-0" />
            <col className="hidden w-[5.5rem] sm:table-column sm:pr-3 md:pr-0 lg:pr-0" />
            <col className="hidden w-[5.5rem] md:table-column md:pr-0 lg:hidden xl:table-column" />
            <col className="hidden w-[5.5rem] md:table-column md:pr-3 lg:hidden xl:table-column" />
            <col className="hidden w-[5.5rem] lg:table-column lg:pr-3 xl:pr-5 2xl:pr-0" />
            <col className="hidden w-36 text-left 2xl:table-column 2xl:pr-5" />
          </colgroup>
          <thead>
            <tr className="text-right font-semibold text-zinc-400">
              <th className="py-2.5 pl-3 text-left 2xl:pl-5">Company</th>
              <th>Current</th>
              <th className="sm:pr-0">Change</th>
              <th className="pr-3 sm:pr-0">% Change</th>
              <th className="hidden sm:table-cell sm:pr-0 md:pr-0 lg:pr-0">
                High
              </th>
              <th className="hidden sm:table-cell sm:pr-3 md:pr-0 lg:pr-0">
                Low
              </th>
              <th className="hidden md:table-cell md:pr-0 lg:hidden xl:table-cell">
                Open
              </th>
              <th className="hidden md:table-cell md:pr-3 lg:hidden xl:table-cell">
                Close
              </th>
              <th className="hidden lg:table-cell lg:pr-3 xl:pr-5 2xl:pr-0">
                <span className="hidden 2xl:inline">Market Cap</span>
                <span className="2xl:hidden">Mkt. Cap</span>
              </th>
              <th className="hidden pl-7 text-left 2xl:table-cell 2xl:pr-5">
                Industry
              </th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </table>
      )}
    </div>
  );
}
