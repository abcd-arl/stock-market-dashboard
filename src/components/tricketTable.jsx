import { Link } from "wouter";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useGetProfilesAndQuotesQuery } from "../redux/finnhub";
import { SOCKET_URL } from "../App";
import { useState, useEffect } from "react";
import { formatMarketCap } from "../utils/format";
import SkeletonLoading from "./skeletonLoading";

export default function TricketTable({ title, companies, displayError }) {
  // const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
  //   SOCKET_URL,
  //   { share: true },
  // );
  // const { data, isLoading, isSuccess, isError, error } =
  //   useGetProfilesAndQuotesQuery(companies);
  // const [trades, setTrades] = useState({});
  // const connectionStatus = {
  //   [ReadyState.CONNECTING]: "Connecting",
  //   [ReadyState.OPEN]: "Open",
  //   [ReadyState.CLOSING]: "Closing",
  //   [ReadyState.CLOSED]: "Closed",
  //   [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  // }[readyState];

  // useEffect(() => {
  //   if (isSuccess && connectionStatus === "Open") {
  //     companies.forEach((symbol) => {
  //       sendJsonMessage({ type: "subscribe", symbol: symbol });
  //     });
  //   }
  // }, [isSuccess]);
  const trades = {
    GTLB: {
      profile: {
        country: "US",
        currency: "USD",
        estimateCurrency: "USD",
        exchange: "NASDAQ NMS - GLOBAL MARKET",
        finnhubIndustry: "Technology",
        ipo: "2021-10-14",
        logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/950467098196.svg",
        marketCapitalization: 10087.518369,
        name: "GitLab Inc",
        phone: "16504745175",
        shareOutstanding: 155.7,
        ticker: "GTLB",
        weburl: "https://about.gitlab.com/",
      },
      quote: {
        c: 67.2575,
        d: 2.5375,
        dp: 3.9207,
        h: 67.4,
        l: 64.645,
        o: 64.74,
        pc: 64.72,
        t: 1702565801,
      },
    },
    JNJ: {
      profile: {
        country: "US",
        currency: "USD",
        estimateCurrency: "USD",
        exchange: "NEW YORK STOCK EXCHANGE, INC.",
        finnhubIndustry: "Pharmaceuticals",
        ipo: "1944-09-25",
        logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/JNJ.svg",
        marketCapitalization: 375029.9113940001,
        name: "Johnson & Johnson",
        phone: "17325242455",
        shareOutstanding: 2407.28,
        ticker: "JNJ",
        weburl: "https://www.jnj.com/",
      },
      quote: {
        c: 155.43,
        d: -0.36,
        dp: -0.2311,
        h: 156.58,
        l: 155.1102,
        o: 156.18,
        pc: 155.79,
        t: 1702565809,
      },
    },
    NVDA: {
      profile: {
        country: "US",
        currency: "USD",
        estimateCurrency: "USD",
        exchange: "NASDAQ NMS - GLOBAL MARKET",
        finnhubIndustry: "Semiconductors",
        ipo: "1999-01-22",
        logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/NVDA.svg",
        marketCapitalization: 1187773.612061,
        name: "NVIDIA Corp",
        phone: "14084862000",
        shareOutstanding: 2470,
        ticker: "NVDA",
        weburl: "https://www.nvidia.com/",
      },
      quote: {
        c: 484.7,
        d: 3.82,
        dp: 0.7944,
        h: 486.7,
        l: 480.75,
        o: 484.28,
        pc: 480.88,
        t: 1702565781,
      },
    },
    AMD: {
      profile: {
        country: "US",
        currency: "USD",
        estimateCurrency: "USD",
        exchange: "NASDAQ NMS - GLOBAL MARKET",
        finnhubIndustry: "Semiconductors",
        ipo: "1979-10-15",
        logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/AMD.svg",
        marketCapitalization: 223245.797124,
        name: "Advanced Micro Devices Inc",
        phone: "14087494000",
        shareOutstanding: 1615.5,
        ticker: "AMD",
        weburl: "https://www.amd.com/en",
      },
      quote: {
        c: 141.3999,
        d: 3.2099,
        dp: 2.3228,
        h: 141.56,
        l: 138.58,
        o: 138.79,
        pc: 138.19,
        t: 1702565807,
      },
    },
    DIS: {
      profile: {
        country: "US",
        currency: "USD",
        estimateCurrency: "USD",
        exchange: "NEW YORK STOCK EXCHANGE, INC.",
        finnhubIndustry: "Media",
        ipo: "1957-11-12",
        logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/DIS.svg",
        marketCapitalization: 169908.23001599996,
        name: "Walt Disney Co",
        phone: "18185601000",
        shareOutstanding: 1830.32,
        ticker: "DIS",
        weburl: "https://thewaltdisneycompany.com/",
      },
      quote: {
        c: 93.859,
        d: 1.029,
        dp: 1.1085,
        h: 94.46,
        l: 93.14,
        o: 93.14,
        pc: 92.83,
        t: 1702565800,
      },
    },
  };
  const data = trades;
  const isLoading = true;
  const isSuccess = true;
  const isError = false;
  const error = {};
  if (isError && error.status == 429) return displayError("429");

  // useEffect(() => {
  //   if (lastJsonMessage?.type === "trade") {
  //     const newTrades = { ...trades };
  //     lastJsonMessage.data.forEach((trade) => {
  //       newTrades[trade.s] = trade;
  //     });
  //     setTrades(newTrades);
  //   }
  // }, [lastJsonMessage]);

  return (
    <div className="w-full overflow-auto rounded-md border border-gray-300 px-2 py-4 shadow">
      <h2 className="mb-1 pl-3 text-2xl font-bold xl:pl-5">{title}</h2>
      <table className="w-full border-collapse text-right text-sm">
        <thead>
          <tr className="text-right font-semibold text-zinc-400">
            <th className="w-10 py-2.5 pl-3 text-left xl:pl-5">Company</th>
            <th className="w-28">Current</th>
            <th className="w-28 sm:pr-0">Change</th>
            <th className="w-28 pr-3 sm:pr-0">% Change</th>
            <th className="hidden w-28 sm:table-cell sm:pr-0 md:pr-0 lg:pr-0">
              High
            </th>
            <th className="hidden w-28 sm:table-cell sm:pr-3 md:pr-0 lg:pr-0">
              Low
            </th>
            <th className="hidden w-28 md:table-cell md:pr-0 lg:hidden xl:table-cell">
              Open
            </th>
            <th className="hidden w-28 md:table-cell md:pr-3 lg:hidden xl:table-cell">
              Prev Close
            </th>
            <th className="hidden w-28 lg:table-cell lg:pr-3 xl:pr-5 2xl:pr-0">
              <span className="hidden 2xl:inline">Market Cap</span>
              <span className="2xl:hidden">Mkt. Cap</span>
            </th>
            <th className="hidden w-28 pl-7 text-left 2xl:table-cell 2xl:pr-5">
              Industry
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            Array(6)
              .fill()
              .map((_, i) => (
                <tr
                  key={i}
                  className="rounded-full border-y border-gray-100 text-right last:border-0 hover:bg-gray-50"
                >
                  <td className="flex w-52 items-center py-2 pl-5 text-left font-sans">
                    <SkeletonLoading className="mr-2 h-6 w-6 rounded-full" />
                    <div className="flex gap-2">
                      <SkeletonLoading className="h-2 w-16" />
                      <SkeletonLoading className="h-2 w-20" />
                    </div>
                  </td>
                  <td className="pl-7">
                    <SkeletonLoading className="ml-auto h-2 w-16" />
                  </td>

                  <td className="pl-7">
                    <SkeletonLoading className="ml-auto h-2 w-16" />
                  </td>
                  <td className="pl-7">
                    <SkeletonLoading className="ml-auto h-2 w-16" />
                  </td>
                  <td className="pl-7">
                    <SkeletonLoading className="ml-auto h-2 w-16" />
                  </td>
                  <td className="pl-7">
                    <SkeletonLoading className="ml-auto h-2 w-16" />
                  </td>
                  <td className="pl-7">
                    <SkeletonLoading className="ml-auto h-2 w-16" />
                  </td>
                  <td className="pl-7">
                    <SkeletonLoading className="ml-auto h-2 w-16" />
                  </td>
                  <td className="pl-7">
                    <SkeletonLoading className="ml-auto h-2 w-16" />
                  </td>
                  <td className="pl-7 pr-5 text-left font-sans">
                    <SkeletonLoading className="h-2  w-24" />
                  </td>
                </tr>
              ))}
          {!isLoading &&
            Object.keys(data).map((symbol) => {
              const name = data[symbol].profile.name;
              const logo = data[symbol].profile.logo;

              const high = data[symbol].quote.h.toFixed(3);
              const low = data[symbol].quote.l.toFixed(3);
              const open = data[symbol].quote.o.toFixed(3);
              const close = data[symbol].quote.pc.toFixed(3);

              const current = trades[symbol]?.p
                ? trades[symbol]?.p.toFixed(3)
                : data[symbol].quote.c.toFixed(3);
              const change = (current - close).toFixed(3);
              const percentChange = ((change / close) * 100).toFixed(3);

              const marketCap = formatMarketCap(
                data[symbol].profile.marketCapitalization,
              );
              const industry = data[symbol].profile.finnhubIndustry;

              return (
                <tr
                  key={symbol}
                  className="rounded-full border-y border-gray-100 text-right font-mono last:border-0 hover:bg-gray-50"
                >
                  <td className="py-2 pl-3 text-left font-sans xl:pl-5">
                    <Link
                      to={`/profile/${symbol}`}
                      className="flex items-center"
                    >
                      <div className="mr-2 h-6 shrink-0 basis-6 rounded-full bg-gray-200">
                        <img
                          src={logo}
                          alt={name}
                          className="h-6 w-6 rounded-full"
                        />
                      </div>
                      <div className="flex w-full gap-2">
                        <h3 className="font-bold">{symbol}</h3>
                        <p className="2xl:w-38 hidden w-full overflow-hidden overflow-ellipsis whitespace-nowrap 2xl:block">
                          {name}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="">
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
            })}
        </tbody>
      </table>
    </div>
  );
}
