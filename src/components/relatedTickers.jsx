import { Link } from "wouter";
import { formatMarketCap } from "../utils/format";
import { useGetPeersProfilesAndQuotesQuery } from "../redux/finnhub";

export default function RelatedTickers({ symbol }) {
  const { data, error, isLoading, isFetching } =
    useGetPeersProfilesAndQuotesQuery({
      symbol,
      grouping: "industry",
    });
  if (isLoading || isFetching) return <div>Loading...</div>;
  if (error) return <div>Oh no, there was an error</div>;

  console.log(data);

  return (
    <div className="mt-10">
      <h3 className="mb-2 text-xs font-bold uppercase text-zinc-500">
        Companies on the Same Industry
      </h3>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="p-10 text-right font-semibold text-zinc-400">
            <th className="py-2.5 pl-3 text-left">Company</th>
            <th>Current</th>
            <th>Change</th>
            <th>Change %</th>
            <th>High</th>
            <th>Low</th>
            <th>Open</th>
            <th>Close</th>
            <th className="pr-3">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(data).map((symbol) => {
            const {
              logo,
              name,
              marketCapitalization: marketCap,
            } = data[symbol].profile;
            const {
              c: current,
              d: change,
              dp: percentChange,
              h: high,
              l: low,
              o: open,
              pc: close,
            } = data[symbol].quote;

            return (
              <tr
                key={symbol}
                className="rounded-full border-y border-gray-100 text-right font-mono last:border-0 hover:bg-gray-50"
              >
                <td className="w-36 py-2 pl-3 text-left font-sans">
                  <Link
                    to={`/profile/${symbol}`}
                    className="flex w-fit items-center"
                  >
                    <div className="mr-2 h-6 shrink-0 basis-6 rounded-full bg-gray-200">
                      <img
                        src={logo}
                        alt={name}
                        className="h-6 w-6 rounded-full"
                      />
                    </div>
                    <div className="flex w-fit gap-2">
                      <h3 className="font-bold">{symbol}</h3>
                      <p className="w-36 overflow-hidden overflow-ellipsis whitespace-nowrap">
                        {name}
                      </p>
                    </div>
                  </Link>
                </td>
                <td>{current?.toFixed(3)}</td>
                <td
                  className={`sm:pr-0 ${
                    change < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {change > 0 ? "+" : ""}
                  {change.toFixed(3)}
                </td>
                <td
                  className={`pr-3 sm:pr-0 ${
                    percentChange < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {change > 0 ? "+" : ""}
                  {percentChange.toFixed(3)}
                </td>
                <td>{high.toFixed(3)}</td>
                <td>{low.toFixed(3)}</td>
                <td>{open.toFixed(3)}</td>
                <td>{close.toFixed(3)}</td>
                <td className="pr-3">{formatMarketCap(marketCap)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
