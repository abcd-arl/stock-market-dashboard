import TricketTable from "../components/tricketTable";
import MarketNews from "../components/marketNews";
import Error from "./error";

export default function Home() {
  const topTrickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA"];
  const trendingTrickers = ["NIO", "GTLB", "JNJ", "NVDA", "AMD", "DIS"];

  function displayError(type) {
    return <Error type={type} />;
  }

  return (
    <>
      <TricketTable
        title={"Top Tickers"}
        companies={topTrickers}
        displayError={displayError}
      />
      <TricketTable
        title={"Trending Tickers"}
        companies={trendingTrickers}
        displayError={displayError}
      />
      <MarketNews displayError={displayError} />
    </>
  );
}
