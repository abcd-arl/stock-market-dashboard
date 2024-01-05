import { useGetCompanyNewsQuery } from "../redux/finnhub";
import { formatDatetime } from "../utils/format";
import SkeletonLoading from "./skeletonLoading";

export default function CompanyNews({ symbol }) {
  const fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - 1);
  const fromDateStr = fromDate.toISOString().slice(0, 10);
  const toDateStr = new Date().toISOString().slice(0, 10);

  const {
    data: news,
    isFetching: isFetchingNews,
    isError: isErrorNews,
    isSuccess: isSuccessNews,
    error: errorNews,
    refetch,
  } = useGetCompanyNewsQuery({
    symbol,
    from: fromDateStr,
    to: toDateStr,
  });

  let content;
  if (isFetchingNews) {
    content = Array(6)
      .fill()
      .map((_, index) => (
        <div key={index} className="mb-1 border-b pb-3">
          <SkeletonLoading className="mb-2 h-2 w-1/4" />
          <SkeletonLoading className="mb-1 h-2 w-full" />
          <SkeletonLoading className="mb-2 h-2 w-full" />
        </div>
      ));
  } else if (isErrorNews && errorNews.status == 429) {
    content = (
      <div className="text-sm">
        <p>
          You have reached the maximum API call limit. Please try again after a
          minute. Click{" "}
          <span className="text-blue-500" onClick={refetch}>
            here
          </span>{" "}
          to refetch.
        </p>
      </div>
    );
  } else if (isSuccessNews && news.length === 0) {
    content = <p className="text-sm">No news found.</p>;
  } else {
    content = news.map((article) => (
      <a
        key={article.id}
        className="mb-1 flex cursor-pointer flex-col-reverse items-start justify-end border-b pb-4 last:pb-0"
        href={article.url}
        target="_blank"
      >
        <h2 className="mr-1 text-sm font-semibold">{article.headline}</h2>
        <p className="mb-2 inline text-xs">
          <span className="">{article.source}</span> |{" "}
          <span>{formatDatetime(article.datetime)}</span>
        </p>
      </a>
    ));
  }

  return (
    <div className="w-full py-2">
      <h1 className="mb-4 mt-1 text-2xl font-bold">Company News</h1>
      <div className="last-two-children grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-2">
        {content}
      </div>
    </div>
  );
}
