import { useGetPeersProfilesAndQuotesQuery } from "../redux/finnhub";

export default function RelatedTickers({ symbol }) {
  const { data, error, isLoading, isFetching } =
    useGetPeersProfilesAndQuotesQuery({
      symbol,
      grouping: "industry",
    });
  if (isLoading || isFetching) return <div>Loading...</div>;
  if (error) return <div>Oh no, there was an error</div>;

  return (
    <div className="">
      <h3 className="mb-5 text-2xl font-bold">Related Tickers</h3>
      <div className="grid grid-cols-3 gap-x-6 gap-y-2">
        {Object.keys(data).map((symbol) => {
          const name = data[symbol].profile.name;
          const logo = data[symbol].profile.logo;
          const close = data[symbol].quote.pc.toFixed(3);

          const current = data[symbol].quote.c.toFixed(3);
          const change = (current - close).toFixed(3);
          const percentChange = ((change / close) * 100).toFixed(3);

          return (
            <div
              key={symbol}
              className={`flex w-full items-center justify-between rounded border p-2 text-sm`}
            >
              <div className="flex items-center gap-2.5">
                <img src={logo} alt={name} className="h-8 w-8 rounded-full" />
                <p className="font-bold">{symbol}</p>
              </div>
              <p
                className={`${change < 0 ? "text-red-600" : "text-green-600"}`}
              >
                <span className="font-mono">{current}</span> USD
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
