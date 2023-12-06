import useWebSocket, { ReadyState } from "react-use-websocket";
import { useGetProfileAndQuoteQuery } from "../redux/finnhub";
import { SOCKET_URL } from "../App";
import { useState, useEffect } from "react";

export default function Table({ title, companies }) {
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

  const formatMarketCap = (marketCap) => {
    if (marketCap < 1) return marketCap.toFixed(3) + "K";
    if (marketCap < 1000) return marketCap.toFixed(3) + "M";
    if (marketCap < 1000000) return (marketCap / 1000).toFixed(3) + "B";
    if (marketCap < 1000000000) return (marketCap / 1000000).toFixed(3) + "T";
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full rounded border px-2 py-4">
      <h2 className="mb-1 pl-5 text-2xl font-bold">{title}</h2>
      <table className="text-sm">
        <thead>
          <tr className="text-right text-zinc-400">
            <th className="w-48 py-2.5 pl-5 text-left font-semibold">
              Company
            </th>
            <th className="w-28 font-semibold">Current</th>
            <th className="w-28 font-semibold">Change</th>
            <th className="w-28 font-semibold">% Change</th>
            <th className="w-28 font-semibold">High</th>
            <th className="w-28 font-semibold">Low</th>
            <th className="w-28 font-semibold">Open</th>
            <th className="w-28 font-semibold">Close</th>
            <th className="w-28 font-semibold">Market Cap</th>
            <th className="w-44 pl-12 text-left">Industry</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(data).map((symbol) => {
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
                <td className="flex w-48 items-center py-2 pl-5 text-left font-sans">
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
                <td className="pl-12">{current}</td>
                <td
                  className={`w-24 pl-12 ${
                    change < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {change > 0 ? "+" : ""}
                  {change}
                </td>
                <td
                  className={`pl-12 ${
                    percentChange < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {change > 0 ? "+" : ""}
                  {percentChange}
                </td>
                <td className="pl-12">{high}</td>
                <td className="pl-12">{low}</td>
                <td className="pl-12">{open}</td>
                <td className="pl-12">{close}</td>
                <td className="pl-12">{marketCap}</td>
                <td className="pl-12 pr-5 text-left font-sans">{industry}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
