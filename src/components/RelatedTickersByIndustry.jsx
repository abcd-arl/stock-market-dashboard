import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  useGetPeersQuery,
  useLazyGetProfilesAndQuotesWithLimitQuery,
} from "../redux/finnhub";
import { formatMarketCap } from "../utils/format";
import SkeletonLoading from "./skeletonLoading";

export default function RelatedTickersByIndustry({ symbol }) {
  const [relatedTickers, setRelatedTickers] = useState(null);
  const [peersToGet, setPeersToGet] = useState([]);
  const {
    data: peers,
    isSuccess: isSuccessPeers,
    isError: isErrorPeers,
    error: errorPeers,
    refetch: refetchPeers,
  } = useGetPeersQuery({
    symbol,
    grouping: "industry",
  });
  const [
    getTickersProfileAndQuote,
    {
      data: peersProfilesAndQuotes,
      isFetching: peersProfilesAndQuotesIsFetching,
      isSuccess: peersProfilesAndQuotesIsSuccess,
      isError: peersProfilesAndQuotesIsError,
      error: peersProfilesAndQuotesError,
    },
  ] = useLazyGetProfilesAndQuotesWithLimitQuery();
  const [shouldComponentBeLoading, setShouldComponentBeLoading] =
    useState(true);
  const [shouldItemsBeLoading, setShouldItemsBeLoading] = useState(false);

  useEffect(() => {
    if (isSuccessPeers) {
      const peersWithoutSelf = peers.filter((peer) => peer !== symbol);
      setPeersToGet(peersWithoutSelf);
      getTickersProfileAndQuote({
        peers: peersWithoutSelf,
        limit: 4,
      });
    }
  }, [isSuccessPeers]);

  useEffect(() => {
    if (peersProfilesAndQuotes) {
      setRelatedTickers((relatedTickers) => ({
        ...relatedTickers,
        ...peersProfilesAndQuotes.available,
      }));
      setPeersToGet((peersToGet) =>
        peersToGet.filter(
          (peer) =>
            !Object.keys(peersProfilesAndQuotes.available).includes(peer) &&
            !Object.keys(peersProfilesAndQuotes.unavailable).includes(peer),
        ),
      );
    }
  }, [peersProfilesAndQuotes]);

  useEffect(() => {
    if (relatedTickers) {
      setShouldComponentBeLoading(false);
      setShouldItemsBeLoading(false);
    }
  }, [relatedTickers]);

  const loadMorePeers = (limit = 2) => {
    setShouldItemsBeLoading(true);
    if (peersToGet.length === 0) {
      refetchPeers();
      shouldComponentBeLoading(true);
    } else {
      getTickersProfileAndQuote({
        peers: peersToGet,
        limit,
      });
    }
  };

  const SkeletonHeader = () => (
    <>
      <div className="pl-2 text-left">
        <SkeletonLoading className="h-2 w-10" />
      </div>
      <div className="flex  items-center justify-end">
        <SkeletonLoading className="h-2 w-10" />
      </div>
      <div className={"flex items-center justify-end"}>
        <SkeletonLoading className="h-2 w-10" />
      </div>
      <div className="flex items-center justify-end md:pr-2 xl:pr-0">
        <SkeletonLoading className="h-2 w-10" />
      </div>
      <div className="flex items-center justify-end pr-2 md:hidden xl:flex">
        <SkeletonLoading className="h-2 w-10" />
      </div>
    </>
  );
  const SkeletonItem = () => (
    <div className="grid grid-cols-[1.5fr_1.2fr_1.2fr_1.2fr_2fr] gap-2 border-b py-1.5 md:grid-cols-[2fr_1.5fr_1.5fr_1.5fr] xl:grid-cols-[1.5fr_1.2fr_1.2fr_1.2fr_2fr]">
      <div className="pl-2">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6">
            <SkeletonLoading className="h-full w-full rounded-full" />
          </div>
          <div className="flex gap-2">
            <SkeletonLoading className="h-2 w-10" />
          </div>
        </div>
      </div>
      <div className={"flex items-center justify-end"}>
        <SkeletonLoading className="h-2 w-10" />
      </div>
      <div className="flex items-center justify-end">
        <SkeletonLoading className="h-2 w-10" />
      </div>
      <div className="flex items-center justify-end md:pr-2 xl:pr-0">
        <SkeletonLoading className="h-2 w-10" />
      </div>
      <div className="flex items-center justify-end pr-2 md:hidden xl:flex">
        <SkeletonLoading className="h-2 w-10" />
      </div>
    </div>
  );
  const Header = () => (
    <>
      <div className="w-10 pl-2 text-left">Company</div>
      <div>Current</div>
      <div>Change</div>
      <div className="md:pr-2 xl:pr-0">
        % <span className="md:hidden">Change</span>
      </div>
      <div className="pr-2 md:hidden xl:block">
        <span className="hidden xl:inline">Market Cap</span>
        <span className="xl:hidden">Mkt. Cap</span>
      </div>
    </>
  );

  let content;
  if (
    (isErrorPeers && errorPeers.status == 429) ||
    (peersProfilesAndQuotesIsError && peersProfilesAndQuotesError.status == 429)
  ) {
    content = (
      <div className="text-sm">
        <p>
          You have reached the maximum API call limit. Please try again after a
          minute.
        </p>
      </div>
    );
  } else if (shouldComponentBeLoading) {
    content = (
      <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        <div className="grid grid-cols-[1.5fr_1.2fr_1.2fr_1.2fr_1.8fr] gap-2 border-b pb-1.5 text-right text-xs md:grid-cols-[2fr_1.5fr_1.5fr_1.5fr] xl:grid-cols-[1.5fr_1.2fr_1.2fr_1.2fr_2fr]">
          <SkeletonHeader />
        </div>
        <div className="hidden grid-cols-[1.5fr_1.2fr_1.2fr_1.2fr_1.8fr] gap-2 border-b pb-1.5 text-right text-xs md:grid md:grid-cols-[2fr_1.5fr_1.5fr_1.5fr] xl:hidden xl:grid-cols-[1.5fr_1.2fr_1.2fr_1.2fr_2fr] 2xl:grid">
          <SkeletonHeader />
        </div>
        {Array(4)
          .fill()
          .map((_, index) => (
            <SkeletonItem key={index} />
          ))}
      </div>
    );
  } else if (
    isSuccessPeers &&
    peersProfilesAndQuotesIsSuccess &&
    Object.keys(relatedTickers).length === 0
  ) {
    return;
  } else {
    content = (
      <>
        <div
          className={`grid grid-cols-1 gap-x-3 xl:grid-cols-1 ${
            Object.keys(relatedTickers).length > 1
              ? "md:grid-cols-2 2xl:grid-cols-2"
              : "md:grid-cols-1 2xl:grid-cols-1"
          }`}
        >
          {Object.keys(relatedTickers).length > 0 && (
            <div className="grid grid-cols-[1.5fr_1.2fr_1.2fr_1.2fr_1.8fr] gap-2 border-b pb-1.5 text-right text-xs md:grid-cols-[2fr_1.5fr_1.5fr_1.5fr] xl:grid-cols-[1.5fr_1.2fr_1.2fr_1.2fr_2fr]">
              <Header />
            </div>
          )}
          {Object.keys(relatedTickers).length > 1 && (
            <div className="hidden grid-cols-[1.5fr_1.2fr_1.2fr_1.2fr_1.8fr] gap-2 border-b pb-1.5 text-right text-xs md:grid md:grid-cols-[2fr_1.5fr_1.5fr_1.5fr] xl:hidden xl:grid-cols-[1.5fr_1.2fr_1.2fr_1.2fr_2fr] 2xl:grid">
              <Header />
            </div>
          )}
          {Object.keys(relatedTickers).map((symbol) => {
            const {
              logo,
              name,
              currency,
              marketCapitalization: marketCap,
            } = relatedTickers[symbol].profile;
            const {
              c: current,
              d: change,
              dp: percentChange,
            } = relatedTickers[symbol].quote;

            return (
              <div
                key={symbol}
                className="grid grid-cols-[1.5fr_1.2fr_1.2fr_1.2fr_1.8fr] gap-2 border-b py-1.5 font-mono hover:bg-gray-50 md:grid-cols-[2fr_1.5fr_1.5fr_1.5fr] md:text-xs xl:grid-cols-[1.5fr_1.2fr_1.2fr_1.2fr_2fr] 2xl:text-xs"
              >
                <div className="pl-2">
                  <Link
                    to={`/profile/${symbol}`}
                    key={symbol}
                    className="flex items-center gap-2 font-sans"
                  >
                    <div className="h-6 w-6 rounded-full bg-gray-300">
                      <img
                        src={logo}
                        alt={name}
                        className="h-full w-full rounded-full"
                      />
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold">{symbol}</span>
                    </div>
                  </Link>
                </div>
                <div className={"flex items-center justify-end font-mono"}>
                  {current.toFixed(2)}
                </div>
                <div
                  className={`flex items-center justify-end ${
                    change > 0
                      ? "text-green-600"
                      : change < 0
                        ? "text-red-600"
                        : ""
                  }`}
                >
                  {change > 0 ? "+" : ""}
                  {change.toFixed(2)}
                </div>
                <div
                  className={`flex items-center justify-end md:pr-2 xl:pr-0 ${
                    change > 0
                      ? "text-green-600"
                      : change < 0
                        ? "text-red-600"
                        : ""
                  }`}
                >
                  {change > 0 ? "+" : ""}
                  {percentChange.toFixed(2)}%
                </div>
                <div className="flex items-center justify-end gap-1 pr-2 md:hidden xl:flex">
                  {formatMarketCap(marketCap)}
                  <span className="font-sans"> {currency}</span>
                </div>
              </div>
            );
          })}
          {shouldItemsBeLoading && (
            <>
              <SkeletonItem />
              <SkeletonItem />
            </>
          )}
        </div>
        <div className="mt-3 space-y-0.5 text-right text-xs text-zinc-500 sm:mb-0">
          <p>
            <span className="text-[0.7rem]">&#9432;</span> Results were
            generated a few mins ago. Currency in USD except where otherwise
            noted.
          </p>
        </div>
      </>
    );
  }

  let options;
  if (
    peersProfilesAndQuotesIsError &&
    peersProfilesAndQuotesError.status == 429
  ) {
    options = (
      <p className="mb-5 text-right text-xs">
        Click{" "}
        <span
          className="cursor-pointer text-blue-500"
          onClick={() => loadMorePeers()}
        >
          here
        </span>{" "}
        to refetch.
      </p>
    );
  } else if (Object.keys(peersToGet).length > 0) {
    options = peersProfilesAndQuotesIsFetching ? (
      <div className="mb-5 flex gap-3 text-right text-xs">Loading...</div>
    ) : (
      <div className="mb-5 flex gap-3 text-right text-xs text-slate-500">
        <button onClick={() => loadMorePeers()}>See more</button>
        <button onClick={() => loadMorePeers(peersToGet.length)}>
          See all
        </button>
      </div>
    );
  }

  return (
    <div className="mb-2 text-xs">
      <div className="flex items-end justify-between">
        <div className="mb-5 mt-2 text-xs font-semibold uppercase text-zinc-500">
          Companies on the Same Industry
        </div>
        <div>{options}</div>
      </div>
      {content}
    </div>
  );
}
