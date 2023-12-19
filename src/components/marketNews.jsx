import { useGetMarketNewsQuery } from "../redux/finnhub";
import { formatDatetime } from "../utils/format";
import SkeletonLoading from "./skeletonLoading";

export default function MarketNews({ displayError }) {
  const { data, isError, error, isLoading } = useGetMarketNewsQuery();

  if (isError && error.status == 429) return displayError("429");

  return (
    <div className="rounded-md border border-gray-300 px-8 py-4 text-[0.8rem] shadow">
      <h2 className="mb-6 text-2xl font-bold">Market News</h2>
      <div className="grid grid-cols-1 gap-x-10 gap-y-7 2xl:grid-cols-2">
        {isLoading &&
          Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="w-full border-b border-gray-200 pb-5 hover:text-zinc-500"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="basis-[70%] space-y-3">
                    <div className="text-base font-bold">
                      <SkeletonLoading className="h-2 w-full" />
                    </div>
                    <div className="flex gap-2">
                      <SkeletonLoading className="h-2 w-16" />
                      <SkeletonLoading className="h-2 w-16" />
                    </div>
                    <div className="space-y-2">
                      <SkeletonLoading className="h-2 w-full" />
                      <SkeletonLoading className="h-2 w-full" />
                      <SkeletonLoading className="h-2 w-full" />
                      <SkeletonLoading className="h-2 w-2/3" />
                    </div>
                  </div>
                  <div className="h-28 shrink-0 basis-48">
                    <SkeletonLoading className="h-full w-full" />
                  </div>
                </div>
              </div>
            ))}
        {!isLoading &&
          data.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              className="w-full border-b border-gray-200 pb-8 hover:text-zinc-500"
            >
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="basis-[70%] space-y-2">
                  <h3 className="mb-1 text-base font-bold">
                    {article.headline.startsWith(":")
                      ? article.headline.slice(1).trim()
                      : article.headline}
                  </h3>
                  <p className="mb-2 text-gray-500">
                    {formatDatetime(article.datetime)} | {article.source}
                  </p>
                  <p className="text-sm">{article.summary}</p>
                </div>
                <div className="h-28 shrink-0 basis-48">
                  <img
                    src={article.image}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </a>
          ))}
      </div>
    </div>
  );
}
