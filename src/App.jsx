import Home from "./pages/home";
import DateTimeDisplay from "./components/datetimeDisplay";
import SearchBox from "./components/searchBox";
import WatchList from "./components/watchList";

export const SOCKET_URL =
  "wss://ws.finnhub.io?token=clmf669r01qjiveu7n70clmf669r01qjiveu7n7g";

function App() {
  const topTrickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA"];
  const trendingTrickers = ["NIO", "GTLB", "JNJ", "NVDA", "AMD", "DIS"];
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
    <div className="relative m-auto flex max-w-[1700px] gap-1.5 p-2 text-zinc-700">
      <main className="w-[75%] space-y-1.5">
        <Home />
      </main>
      <aside className="relative flex w-[25%] flex-col gap-1.5">
        <SearchBox />
        <DateTimeDisplay />
        <WatchList
          symbols={initialWatchListTrickers}
          topAndTrendingTickers={new Set(topTrickers.concat(trendingTrickers))}
        />
      </aside>
    </div>
  );
}

export default App;
