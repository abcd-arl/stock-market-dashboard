import { useGetMarketNewsQuery } from "../redux/finnhub";

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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="rounded border px-8 py-4 text-[0.8rem]">
      <h2 className="mb-4 text-2xl font-bold">Market News</h2>
      <div className="grid grid-cols-4 gap-6">
        {data.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            className="w-fit"
          >
            <div className="space-y-1.5">
              <img src={article.image} className="h-40 w-96 object-cover" />
              <h3 className="text-lg font-bold">{article.headline}</h3>
              <p className="text-gray-500">
                {article.source} | {formatDatetime(article.datetime)}
              </p>
              <p className="text-sm">{article.summary}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
