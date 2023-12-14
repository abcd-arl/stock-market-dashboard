import { Link } from "wouter";
import Spinner from "../assets/icons8-spinner.gif";
import CompanyInformation from "../components/companyInformation";
import LineChart from "../components/lineChart";
import CompanyNews from "../components/companyNews";
import RelatedTickers from "../components/relatedTickers";
import TricketTable from "../components/tricketTable";
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
        <img src={Spinner} alt="Loading" className="h-9 w-9" />
      </div>
    );
  if (isError && error.status == 403) return <Error type={"403"} />;
  if (isError && error.status == 429) return <Error type={"409"} />;
  if (Object.keys(data).length === 0) return <Error type={"404"} />;

  return (
    <div className="relative w-full rounded-md border-l border-t border-gray-300 py-2 pl-3 pr-1">
      <ul className="not mb-4 mt-2 flex gap-3 pl-3 text-sm">
        <li className="after:inline-block after:pl-3 after:content-['>']">
          <Link to="/">Home</Link>
        </li>
        <li>{symbol}</li>
      </ul>
      <div className="flex gap-3">
        <div className="w-[70%] space-y-2 px-3">
          <div className="flex items-end gap-3">
            <h1 className="text-5xl font-semibold">{symbol}</h1>
            <h2 className="text-3xl">{data.name}</h2>
          </div>
          <LineChart symbol={symbol} />
          <div className="space-y-4">
            <CompanyNews symbol={symbol} />
            <RelatedTickers symbol={symbol} />
            {/* <TricketTable companies={peers} /> */}
          </div>
        </div>
        <div className="w-[30%]">
          <CompanyInformation symbol={symbol} />
        </div>
      </div>
    </div>
  );
}
