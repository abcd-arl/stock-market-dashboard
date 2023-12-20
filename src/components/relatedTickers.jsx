import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  useGetPeersQuery,
  useLazyGetProfilesAndQuotesWithLimitQuery,
} from "../redux/finnhub";
import { formatMarketCap } from "../utils/format";
import SkeletonLoading from "./skeletonLoading";

export default function RelatedTickers({ symbol }) {
  const [relatedTickers, setRelatedTickers] = useState({});
  const [peersToGet, setPeersToGet] = useState([]);
  const {
    data: peers,
    isFetching: isFetchingPeers,
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
      isLoading: peersProfilesAndQuotesIsLoading,
      isFetching: peersProfilesAndQuotesIsFetching,
      isError: peersProfilesAndQuotesIsError,
      error: peersProfilesAndQuotesError,
    },
  ] = useLazyGetProfilesAndQuotesWithLimitQuery({});

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

  const loadMorePeers = (limit = 2) => {
    getTickersProfileAndQuote({
      peers: peersToGet,
      limit,
    });
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
    <div className="grid grid-cols-[1.8fr_1.2fr_1.2fr_1.2fr_1.5fr] gap-2 border-b py-1.5 font-mono text-sm md:grid-cols-[2fr_1.5fr_1.5fr_1.5fr] xl:grid-cols-[1.8fr_1.2fr_1.2fr_1.2fr_1.5fr]">
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
        % <span className="md:hidden xl:inline">Change</span>
      </div>
      <div className="pr-2 md:hidden xl:block">
        <span className="hidden xl:inline">Market Cap</span>
        <span className="xl:hidden">Mkt. Cap</span>
      </div>
    </>
  );

  if (isFetchingPeers || peersProfilesAndQuotesIsLoading)
    return (
      <div className="mt-10">
        <div className="flex items-start justify-between">
          <h3 className="mb-5 text-xs font-bold uppercase text-zinc-500">
            Companies on the Same Industry
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <div className="grid grid-cols-[1.8fr_1.2fr_1.2fr_1.2fr_1.5fr] gap-2 border-b pb-1.5 text-right text-xs md:grid-cols-[2fr_1.5fr_1.5fr_1.5fr] xl:grid-cols-[1.8fr_1.2fr_1.2fr_1.2fr_1.5fr]">
            <SkeletonHeader />
          </div>
          <div className="hidden grid-cols-[1.8fr_1.2fr_1.2fr_1.2fr_1.5fr] gap-2 border-b pb-1.5 text-right text-xs md:grid md:grid-cols-[2fr_1.5fr_1.5fr_1.5fr] xl:hidden xl:grid-cols-[1.8fr_1.2fr_1.2fr_1.2fr_1.5fr] 2xl:grid">
            <SkeletonHeader />
          </div>
          {Array(4)
            .fill()
            .map((_, index) => (
              <SkeletonItem key={index} />
            ))}
        </div>
      </div>
    );

  if (isErrorPeers && errorPeers.status == 429) {
    return (
      <div className="mt-10">
        <h3 className="mb-5 text-xs font-bold uppercase text-zinc-500">
          Companies on the Same Industry
        </h3>
        <div className="text-sm">
          <p>
            You have reached the maximum API call limit. Please try again after
            a minute. Click{" "}
            <span className="text-blue-500" onClick={refetchPeers}>
              here
            </span>{" "}
            to refetch.
          </p>
        </div>
      </div>
    );
  }

  if (peersToGet.length === 0 && Object.keys(relatedTickers).length === 0) {
    return;
  }

  let options;
  if (
    peersProfilesAndQuotesIsError &&
    peersProfilesAndQuotesError.status == 429
  ) {
    options = (
      <p className="text-right text-xs">
        Please try again after a minute. Click{" "}
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
      <div className="space-x-3 text-right text-xs">Loading...</div>
    ) : (
      <div className="space-x-3 text-right text-xs text-slate-500">
        <button onClick={() => loadMorePeers()}>See more</button>
        <button onClick={() => loadMorePeers(peersToGet.length)}>
          See all
        </button>
      </div>
    );
  }

  console.log(Object.keys(peersToGet).length);

  return (
    <div className="mt-10">
      <div className="flex items-start justify-between">
        <div className="mb-5 text-xs font-bold uppercase text-zinc-500">
          Companies on the Same Industry
        </div>
        {options}
      </div>
      <div
        className={`grid grid-cols-1 gap-x-3 xl:grid-cols-1 2xl:grid-cols-2 ${
          Object.keys(relatedTickers).length > 1
            ? "md:grid-cols-2 2xl:grid-cols-2"
            : "md:grid-cols-1 2xl:grid-cols-1"
        }`}
      >
        {Object.keys(relatedTickers).length > 0 && (
          <div className="grid grid-cols-[1.8fr_1.2fr_1.2fr_1.2fr_1.5fr] gap-2 border-b pb-1.5 text-right text-xs md:grid-cols-[2fr_1.5fr_1.5fr_1.5fr] xl:grid-cols-[1.8fr_1.2fr_1.2fr_1.2fr_1.5fr]">
            <Header />
          </div>
        )}
        {Object.keys(relatedTickers).length > 1 && (
          <div className="hidden grid-cols-[1.8fr_1.2fr_1.2fr_1.2fr_1.5fr] gap-2 border-b pb-1.5 text-right text-xs md:grid md:grid-cols-[2fr_1.5fr_1.5fr_1.5fr] xl:hidden xl:grid-cols-[1.8fr_1.2fr_1.2fr_1.2fr_1.5fr] 2xl:grid">
            <Header />
          </div>
        )}
        {Object.keys(relatedTickers).map((symbol) => {
          const {
            logo,
            name,
            marketCapitalization: marketCap,
          } = relatedTickers[symbol].profile;
          const {
            c: current,
            d: change,
            dp: percentChange,
            h: high,
            l: low,
            o: open,
            pc: close,
          } = relatedTickers[symbol].quote;

          return (
            <div
              key={symbol}
              className="grid grid-cols-[1.8fr_1.2fr_1.2fr_1.2fr_1.5fr] gap-2 border-b py-1.5 font-mono text-sm hover:bg-gray-100 md:grid-cols-[2fr_1.5fr_1.5fr_1.5fr] xl:grid-cols-[1.8fr_1.2fr_1.2fr_1.2fr_1.5fr]"
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
                    <span className="font-bold">{symbol}</span>
                    {/* <span>{name}</span> */}
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
                {percentChange.toFixed(2)}%
              </div>
              <div className="flex items-center justify-end pr-2 md:hidden xl:flex">
                {formatMarketCap(marketCap)}
              </div>
            </div>
          );
        })}
        {peersProfilesAndQuotesIsFetching && (
          <>
            <SkeletonItem />
            <SkeletonItem />
          </>
        )}
      </div>
    </div>
  );
}
