import { Switch, Route } from "wouter";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Error from "./pages/error";
import DateTimeDisplay from "./components/dateTimeDisplay";
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
    <div className="relative m-auto flex max-w-[1700px] flex-col gap-1.5 p-2 text-zinc-700 lg:flex-row-reverse">
      <aside className="sticky top-2 z-10 flex flex-col-reverse justify-start gap-1.5 bg-white lg:h-[calc(100vh-1.25rem)] lg:w-[30%] lg:flex-col xl:basis-96">
        <SearchBox />
        <DateTimeDisplay />
        <WatchList
          symbols={initialWatchListTrickers}
          topAndTrendingTickers={new Set(topTrickers.concat(trendingTrickers))}
        />
      </aside>
      <main className="space-y-1.5 lg:w-[70%] xl:w-[calc(100%-24rem)]">
        <Switch>
          <Route path="/">
            <Home />
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
