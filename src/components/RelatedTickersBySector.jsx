import { useGetPeersQuery, useGetProfilesQuery } from "../redux/finnhub";
import { Link } from "wouter";
import SkeletonLoading from "./skeletonLoading";

export default function RelatedTickersBySector({ symbol }) {
  const {
    data: peers,
    isFetching: isFetchingPeers,
    isSuccess: isSuccessPeers,
    isError: isErrorPeers,
    error: errorPeers,
    refetch: refetchPeers,
  } = useGetPeersQuery({
    symbol,
    grouping: "sector",
  });
  const {
    data: profiles,
    isFetching: isFetchingProfiles,
    isSuccess: isSuccessProfiles,
    isError: isErrorProfiles,
    error: errorProfiles,
    refetch: refetchProfiles,
  } = useGetProfilesQuery(peers && peers.filter((peer) => peer !== symbol), {
    skip: !isSuccessPeers,
    refetchOnMountOrArgChange: true,
  });

  let content;
  if (isFetchingPeers || isFetchingProfiles) {
    content = Array(6)
      .fill()
      .map((_, index) => (
        <li
          key={index}
          className="flex items-center gap-2 border-b px-3 py-2.5 last:border-b-0"
        >
          <div className="h-6 basis-6 rounded-full bg-gray-200">
            <SkeletonLoading className="h-6 w-6 rounded-full" />
          </div>
          <div>
            <SkeletonLoading className="h-2 w-12" />
          </div>
          <div>
            <SkeletonLoading className="h-2 w-36" />
          </div>
        </li>
      ));
  } else if (
    (isErrorPeers || isErrorProfiles) &&
    (errorPeers?.status === 429 || errorProfiles?.status === 429)
  ) {
    content = (
      <div className="px-2">
        <p className="text-center">
          You have reached the maximum API call limit. Please try again after a
          minute. Click{" "}
          <span
            className="cursor-pointer text-blue-500"
            onClick={isSuccessPeers ? refetchProfiles : refetchPeers}
          >
            here
          </span>{" "}
          to refetch.
        </p>
      </div>
    );
  } else {
    content = Object.keys(profiles.available).map((symbol) => (
      <li key={symbol} className="border-b last:border-b-0 hover:bg-gray-50">
        <Link
          to={`/profile/${symbol}`}
          className="flex cursor-pointer items-center gap-2 px-2 py-2.5"
          key={symbol}
        >
          <div className="h-6 basis-6 rounded-full bg-gray-200">
            <img
              src={profiles.available[symbol].logo}
              alt={profiles.available[symbol].name}
              className="h-6 w-6 rounded-full"
            />
          </div>
          <div className="font-semibold">{symbol}</div>
          <div>{profiles.available[symbol].name}</div>
        </Link>
      </li>
    ));
  }

  return (
    <div className="rounded-md border px-3 pb-5 pt-7 text-xs">
      <h3 className="mx-2 mb-3 font-semibold uppercase text-zinc-500">
        Companies on the Same Sector
      </h3>
      <ul>{content}</ul>
    </div>
  );
}
