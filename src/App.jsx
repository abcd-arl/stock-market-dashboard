import { Switch, Route } from "wouter";
import TickersTable from "./components/TickersTable";
import MarketNews from "./components/MarketNews";
import Profile from "./pages/Profile";
import Error from "./pages/error";
import DateTime from "./components/DateTime";
import SearchSymbol from "./components/SearchSymbol";
import WatchList from "./components/watchList";

export const SOCKET_URL =
  "wss://ws.finnhub.io?token=clmf669r01qjiveu7n70clmf669r01qjiveu7n7g";

function App() {
  const topTrickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "META"];
  const trendingTrickers = ["NIO", "GTLB", "JNJ", "AMD", "NTDOY"];
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
    <div className="relative m-auto flex max-w-[1700px] flex-col gap-1.5 p-2 text-zinc-700 sm:bg-red-100 md:bg-blue-100 lg:flex-row-reverse lg:bg-green-100 xl:bg-purple-100 2xl:bg-white">
      <aside className="sticky top-2 z-10 flex flex-col-reverse justify-start gap-1.5 bg-white lg:max-h-[calc(100vh-1rem)] lg:w-[30%] lg:flex-col xl:basis-96">
        <SearchSymbol />
        <DateTime />
        <WatchList
          symbols={initialWatchListTrickers}
          topAndTrendingTickers={new Set(topTrickers.concat(trendingTrickers))}
        />
      </aside>
      <main className="space-y-1.5 lg:w-[70%] xl:w-[calc(100%-24rem)]">
        <Switch>
          <Route path="/">
            <TickersTable title={"Top Tickers"} symbols={topTrickers} />
            <TickersTable
              title={"Trending Tickers"}
              symbols={trendingTrickers}
            />
            <MarketNews />
          </Route>
          <Route path="/profile/:symbol">
            {(params) => <Profile symbol={params.symbol} />}
          </Route>
          <Route>
            <Error type={"404"} />
          </Route>
        </Switch>
      </main>
    </div>
  );
}

export default App;
