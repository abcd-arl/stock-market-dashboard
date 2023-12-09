import TricketTable from "../components/tricketTable";
import MarketNews from "../components/marketNews";

export default function Home() {
  const topTrickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA"];
  const trendingTrickers = ["NIO", "GTLB", "JNJ", "NVDA", "AMD", "DIS"];

  return (
    <>
      <TricketTable title={"Top Tickers"} companies={topTrickers} />
      <TricketTable title={"Trending Tickers"} companies={trendingTrickers} />
      <MarketNews />
    </>
  );
}
