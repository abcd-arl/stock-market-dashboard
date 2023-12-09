import { useGetMarketNewsQuery } from "../redux/finnhub";
import SkeletonLoading from "./skeletonLoading";

export default function MarketNews() {
  const { data, error, isLoading } = useGetMarketNewsQuery();

  const formatDatetime = (datetime) => {
    const now = new Date();
    const date = new Date(datetime * 1000);
    const diff = now - date;
    const diffMinutes = Math.floor(diff / 60000);
    const diffHours = Math.floor(diff / 3600000);
    const diffDays = Math.floor(diff / 86400000);
    const diffMonths = Math.floor(diff / 2592000000);

    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffMonths < 12) return `${diffMonths} months ago`;
    return date.toLocaleString();
  };

  return (
    <div className="rounded-md border border-gray-300 px-8 py-4 text-[0.8rem]">
      <h2 className="mb-6 text-2xl font-bold">Market News</h2>
      <div className="flex flex-col gap-5 pr-16">
        {isLoading &&
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="w-full border-b border-gray-200 pb-5 last:border-b-0 hover:text-zinc-500"
              >
                <div className="flex gap-8">
                  <div className="mb-2 basis-[10%] text-gray-500">
                    <SkeletonLoading className="h-2 w-full" />
                  </div>
                  <div className="basis-[70%] space-y-5">
                    <div className="space-y-2">
                      <SkeletonLoading className="mb1 h-2 w-[80%]" />
                      <SkeletonLoading className="h-2 w-24" />
                    </div>
                    <div className="space-y-2">
                      <SkeletonLoading className="h-2 w-full" />
                      <SkeletonLoading className="h-2 w-full" />
                      <SkeletonLoading className="h-2 w-full" />
                      <SkeletonLoading className="h-2 w-[60%]" />
                    </div>
                  </div>
                  <SkeletonLoading className="h-36 w-72" />
                </div>
              </div>
            ))}
        {!isLoading &&
          data.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              className="w-full border-b border-gray-200 pb-5 last:border-b-0 hover:text-zinc-500"
            >
              <div className="flex gap-8">
                <p className="mb-2 basis-[15%] text-gray-500">
                  {formatDatetime(article.datetime)}
                </p>
                <div className="basis-[70%] space-y-3">
                  <h3 className="mb-1 text-base font-bold">
                    {article.headline.startsWith(":")
                      ? article.headline.slice(1).trim()
                      : article.headline}
                  </h3>
                  <p className="mb-2 basis-[15%] text-gray-500">
                    {formatDatetime(article.datetime)}
                  </p>
                  <p className="text-sm">{article.summary}</p>
                </div>
                <img src={article.image} className="h-36 w-64 object-cover" />
              </div>
            </a>
          ))}
      </div>
    </div>
  );
}
