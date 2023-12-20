import { Link } from "wouter";
import Spinner from "../assets/icons8-spinner.gif";
import CompanyInformation from "../components/companyInformation";
import LineChart from "../components/lineChart";
import CompanyNews from "../components/CompanyNews";
import RelatedTickers from "../components/relatedTickers";
import Error from "./error";

import { useGetProfileQuery, useGetPeersQuery } from "../redux/finnhub";

export default function Profile({ symbol }) {
  const { data, isLoading, isFetching, isError, error } =
    useGetProfileQuery(symbol);
  const {
    data: peers,
    error: peersError,
    isLoading: peersIsLoading,
    isFetching: peersIsFetching,
  } = useGetPeersQuery({
    symbol,
    grouping: "industry",
  });

  if (isLoading || isFetching || peersIsLoading || peersIsFetching)
    return (
      <div className="flex h-[calc(100vh-16px)] flex-col items-center justify-center rounded-md border border-gray-300 shadow">
        <img src={Spinner} alt="Loading" className="h-8 w-8" />
      </div>
    );
  if (isError && error.status == 403) return <Error type={"403"} />;
  if (isError && error.status == 429) return <Error type={"409"} />;
  if (Object.keys(data).length === 0) return <Error type={"404"} />;

  return (
    <div className="relative w-full rounded-md border-l border-t border-gray-300 py-2 pl-3 md:pr-1">
      <div className="flex flex-col gap-2 xl:flex-row">
        <div className="w-[100%] px-3 xl:w-[65%] 2xl:basis-full">
          <div className="mb-3 flex items-end gap-2 md:mb-0">
            <Link
              to="/"
              className="absolute -left-1.5 top-3 flex items-center justify-center rounded-full border border-zinc-300 bg-white px-2 py-0.5 text-lg shadow lg:-left-2 lg:px-3 lg:py-1.5"
            >
              &#8592;
            </Link>
            <h1 className="ml-8 text-4xl font-semibold md:text-5xl lg:ml-8">
              {symbol}
            </h1>
            <h2 className="text-lg md:text-3xl">{data.name}</h2>
          </div>
          <LineChart symbol={symbol} />
          <RelatedTickers symbol={symbol} />
          <div className="hidden xl:block">
            <CompanyNews symbol={symbol} />
          </div>

          <div className="xl:hidden">
            <CompanyInformation symbol={symbol} />
            <CompanyNews symbol={symbol} />
          </div>
        </div>
        <div className="hidden xl:block xl:w-[35%] 2xl:w-fit">
          <CompanyInformation symbol={symbol} />
        </div>
      </div>
    </div>
  );
}
