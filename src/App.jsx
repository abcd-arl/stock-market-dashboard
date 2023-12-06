import { useState } from "react";

import Table from "./components/table";
import WatchList from "./components/watchList";
import MarketNews from "./components/marketNews";

export const SOCKET_URL =
  "wss://ws.finnhub.io?token=clmf669r01qjiveu7n70clmf669r01qjiveu7n7g";
const COMPANIES = [
  "AAPL",
  "MSFT",
  "AMZN",
  "GOOGL",
  "META",
  "NIO",
  "GTLB",
  "JNJ",
  "NVDA",
  "AMD",
  "MARA",
  "T",
  "RIOT",
  "AMZN",
  "UBER",
  "SOFI",
  "CMCSA",
  "AMD",
  "PLTR",
  "PLUG",
];

function App() {
  const topTrickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA"];
  const trendingTrickers = ["NIO", "GTLB", "JNJ", "NVDA", "AMD", "NTDOF"];
  const initialWatchListTrickers = [
    "MARA",
    "T",
    "RIOT",
    "AMZN",
    "UBER",
    "SOFI",
    "CMCSA",
    "AMD",
    "PLTR",
    "PLUG",
  ];

  return (
    <div className="flex gap-1.5 p-2.5">
      <main className="w-[75%] space-y-1.5 text-zinc-700">
        <Table title={"Top Tickers"} companies={topTrickers} />
        <Table title={"Trending Tickers"} companies={trendingTrickers} />
        <MarketNews />
      </main>
      <aside className="w-[25%]">
        <WatchList
          symbols={initialWatchListTrickers}
          topAndTrendingTickers={new Set(topTrickers.concat(trendingTrickers))}
        />
      </aside>
    </div>
  );
}

export default App;
