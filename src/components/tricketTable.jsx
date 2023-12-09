import useWebSocket, { ReadyState } from "react-use-websocket";
import { useGetProfileAndQuoteQuery } from "../redux/finnhub";
import { SOCKET_URL } from "../App";
import { useState, useEffect } from "react";
import SkeletonLoading from "./skeletonLoading";

export default function TricketTable({ title, companies }) {
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    SOCKET_URL,
    { share: true },
  );
  const { data, isLoading, isSuccess } = useGetProfileAndQuoteQuery(companies);
  const [trades, setTrades] = useState({});
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const formatMarketCap = (marketCap) => {
    if (marketCap < 1) return marketCap.toFixed(3) + "K";
    if (marketCap < 1000) return marketCap.toFixed(3) + "M";
    if (marketCap < 1000000) return (marketCap / 1000).toFixed(3) + "B";
    if (marketCap < 1000000000) return (marketCap / 1000000).toFixed(3) + "T";
  };

  useEffect(() => {
    if (isSuccess && connectionStatus === "Open") {
      companies.forEach((symbol) => {
        sendJsonMessage({ type: "subscribe", symbol: symbol });
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (lastJsonMessage?.type === "trade") {
      const newTrades = { ...trades };
      lastJsonMessage.data.forEach((trade) => {
        newTrades[trade.s] = trade;
      });
      setTrades(newTrades);
    }
  }, [lastJsonMessage]);

  const columnNames = [
    "Company",
    "Current",
    "Change",
    "% Change",
    "High",
    "Low",
    "Open",
    "Close",
    "Market Cap",
    "Industry",
  ];

  return (
    <div className="w-full overflow-auto rounded-md border border-gray-300 px-2 py-4 shadow">
      <h2 className="mb-1 pl-5 text-2xl font-bold">{title}</h2>
      <table className="border-collapse text-sm">
        <thead>
          <tr className="text-right text-zinc-400">
            {columnNames.map((name) => {
              let className = "w-28 font-semibold";
              if (name === "Company")
                className = "w-52 py-2.5 pl-5 text-left font-semibold";
              if (name === "Industry") className = "w-44 pl-7 text-left";
              return (
                <th key={name} className={className}>
                  {name}
                </th>
              );
            })}
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
                  <td className="flex w-52 items-center py-2 pl-5 text-left font-sans">
                    <img
                      src={logo}
                      alt={name}
                      className="mr-2 h-6 w-6 rounded-full"
                    />
                    <div className="flex w-full gap-2">
                      <h3 className="font-bold">{symbol}</h3>
                      <p className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
                        {name}
                      </p>
                    </div>
                  </td>
                  <td className="pl-7">
                    <span
                      key={"current" + change}
                      className="animate-fade-in ml-auto w-fit"
                    >
                      {current}
                    </span>
                  </td>
                  <td
                    className={`pl-7 ${
                      change < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {change > 0 ? "+" : ""}
                    {change}
                  </td>
                  <td
                    className={`pl-7 ${
                      percentChange < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {change > 0 ? "+" : ""}
                    {percentChange}
                  </td>
                  <td className="pl-7">{high}</td>
                  <td className="pl-7">{low}</td>
                  <td className="pl-7">{open}</td>
                  <td className="pl-7">{close}</td>
                  <td className="pl-7">{marketCap}</td>
                  <td className="pl-7 pr-5 text-left font-sans">{industry}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
