import { Link } from "wouter";
import Spinner from "../assets/icons8-spinner.gif";
import CompanyInformation from "../components/CompanyInformation";
import CompanyNews from "../components/CompanyNews";
import RelatedTickersBySector from "../components/RelatedTickersBySector";
import ProfileHeader from "../components/ProfileHeader";
import HistoricalPrices from "../components/HistoricalPrices";
import Error from "./error";

import { useGetProfileAndQuoteQuery } from "../redux/finnhub";

export default function Profile({ symbol }) {
  const { data, isLoading, isFetching, isError, error } =
    useGetProfileAndQuoteQuery(symbol);

  if (isLoading || isFetching)
    return (
      <div className="flex h-[calc(100vh-16px)] flex-col items-center justify-center rounded-md border border-gray-300 shadow">
        <img src={Spinner} alt="Loading" className="h-8 w-8" />
      </div>
    );

  if (isError && error.status == 403) return <Error type={"403"} />;
  if (isError && error.status == 429) return <Error type={"429"} />;
  if (Object.keys(data).length === 0) return <Error type={"404"} />;

  return (
    <div className="relative w-full rounded-md border-l border-t border-gray-300 py-5 pl-3 md:pr-1">
      <div className="flex flex-col gap-2 xl:flex-row">
        <div className="w-[100%] px-3 xl:w-[65%] 2xl:basis-full">
          <div className="mb-4 flex items-end gap-2 md:mb-0 lg:mb-3 2xl:-mb-0.5">
            <Link
              to="/"
              className="absolute -left-1.5 top-3 flex items-center justify-center rounded-full border border-zinc-300 bg-white px-2 py-0.5 text-lg shadow lg:-left-2 lg:px-3 lg:py-1.5"
            >
              &#8592;
            </Link>
            <ProfileHeader symbol={symbol} data={data} />
          </div>
          <HistoricalPrices key={symbol} symbol={symbol} />
          <div className="hidden xl:block">
            <CompanyNews symbol={symbol} />
          </div>
          <div className="xl:hidden">
            <CompanyInformation symbol={symbol} />
            <CompanyNews symbol={symbol} />
          </div>
        </div>
        <div className="hidden xl:block xl:w-[35%] 2xl:w-96">
          <CompanyInformation symbol={symbol} />
          <RelatedTickersBySector symbol={symbol} />
        </div>
      </div>
    </div>
  );
}
