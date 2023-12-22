import {
  useGetProfileAndQuoteQuery,
  useGetBasicFinancialsQuery,
} from "../redux/finnhub";
import { formatMarketCap, formatPhoneNumber } from "../utils/format";
import SkeletonLoading from "./skeletonLoading";

export default function CompanyInformation({ symbol }) {
  const {
    data: profileAndQuote,
    isLoading: profileAndQuoteIsLoading,
    isFetching: profileAndQuoteIsFetching,
  } = useGetProfileAndQuoteQuery(symbol);
  const {
    data: basicFinancials,
    isLoading: basicFinancialsIsLoading,
    isFetching: basicFinancialsIsFetching,
  } = useGetBasicFinancialsQuery(symbol);

  if (
    profileAndQuoteIsLoading ||
    basicFinancialsIsLoading ||
    profileAndQuoteIsFetching ||
    basicFinancialsIsFetching
  ) {
    return (
      <div className="pt-4 2xl:w-[22rem]">
        <div className="hidden pb-2 md:block xl:hidden">
          <div className="mb-4 pt-3">
            <SkeletonLoading className="h-2 w-24" />
          </div>
          <div className="mb-4 space-y-3.5">
            <SkeletonLoading className="h-2 w-full" />
            <SkeletonLoading className="h-2 w-full" />
            <SkeletonLoading className="h-2 w-full" />
            <SkeletonLoading className="h-2 w-full" />
            <SkeletonLoading className="h-2 w-full md:hidden" />
            <SkeletonLoading className="h-2 w-full md:hidden" />
            <SkeletonLoading className="h-2 w-full md:hidden" />
            <SkeletonLoading className="h-2 w-52" />
          </div>
        </div>
        <div className="my-3 flex flex-col gap-2 md:flex-row xl:flex-col">
          <div className="basis-1/2 rounded-md border px-5 pb-7 pt-4">
            <ul className="w-full">
              {Array(5)
                .fill()
                .map((_, index) => (
                  <li
                    key={index}
                    className="flex items-start justify-between border-b py-4 text-xs last:border-b-0 last:pb-1"
                  >
                    <span className="block w-40">
                      <SkeletonLoading className="h-2 w-16" />
                    </span>
                    <span className="block w-fit">
                      <SkeletonLoading className="h-2 w-16" />
                    </span>
                  </li>
                ))}
            </ul>
          </div>
          <div className="basis-1/2 rounded-md border px-5 pb-7 pt-4">
            <div className="md:hidden xl:block">
              <div className="mb-4 pt-3">
                <SkeletonLoading className="h-2 w-24" />
              </div>
              <div className="mb-4 space-y-3.5">
                <SkeletonLoading className="h-2 w-full" />
                <SkeletonLoading className="h-2 w-full" />
                <SkeletonLoading className="h-2 w-full" />
                <SkeletonLoading className="h-2 w-full" />
                <SkeletonLoading className="h-2 w-full" />
                <SkeletonLoading className="h-2 w-full" />
                <SkeletonLoading className="h-2 w-full" />
                <SkeletonLoading className="h-2 w-52" />
              </div>
            </div>
            <ul className="w-full">
              {Array(5)
                .fill()
                .map((_, index) => (
                  <li
                    key={index}
                    className="flex items-start justify-between border-b py-4 text-xs last:border-b-0 last:pb-1"
                  >
                    <span className="block w-40">
                      <SkeletonLoading className="h-2 w-16" />
                    </span>
                    <span className="block w-fit">
                      <SkeletonLoading className="h-2 w-16" />
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 2xl:w-[22rem]">
      <div className="hidden pb-2 md:block xl:hidden">
        <p className="mb-4 pt-3 text-xs font-semibold uppercase text-zinc-500">
          About {profileAndQuote.profile.name}
        </p>
        <p className="mb-4 hyphens-auto text-justify text-sm leading-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
          ullamcorper purus massa, eu vulputate lectus feugiat non. Nunc id
          felis nunc. Curabitur magna nulla, aliquam quis vehicula eu, vulputate
          a est. Donec varius at ipsum sit amet malesuada. Aenean pellentesque
          neque lectus, a mollis ipsum scelerisque non. Curabitur facilisis
          lacus et eleifend semper.
        </p>
      </div>
      <div className="my-3 flex flex-col gap-2 md:flex-row xl:flex-col">
        <div className="basis-1/2 rounded-md border px-5 pb-7 pt-4">
          <ul className="w-full">
            <li className="flex items-start justify-between border-b py-3 text-xs last:border-b-0 last:pb-1">
              <span className="block font-semibold uppercase text-zinc-500">
                52-Week Range
              </span>
              <span className="block w-fit text-right font-semibold">
                {`${basicFinancials.metric["52WeekLow"]} ${profileAndQuote.profile?.currency} - ${basicFinancials.metric["52WeekHigh"]} ${profileAndQuote.profile?.currency}`}{" "}
              </span>
            </li>
            <li className="flex items-start justify-between border-b py-3 text-xs last:border-b-0 last:pb-1">
              <span className="block font-semibold uppercase text-zinc-500">
                Market Capitalization
              </span>
              <span className="block w-fit text-right font-semibold">
                {formatMarketCap(profileAndQuote.profile?.marketCapitalization)}{" "}
                {profileAndQuote.profile?.currency}
              </span>
            </li>
            <li className="flex items-start justify-between border-b py-3 text-xs last:border-b-0 last:pb-1">
              <span className="block font-semibold uppercase text-zinc-500">
                10-Day Avg. Volume
              </span>
              <span className="block w-fit text-right font-semibold">
                {basicFinancials.metric["10DayAverageTradingVolume"]}
              </span>
            </li>
            <li className="flex items-start justify-between border-b py-3 text-xs last:border-b-0 last:pb-1">
              <span className="block font-semibold uppercase text-zinc-500">
                P/E (TTM)
              </span>
              <span className="block w-fit text-right font-semibold">
                {basicFinancials.metric.peTTM}
              </span>
            </li>
            <li className="flex items-start justify-between border-b py-3 text-xs last:border-b-0 last:pb-1">
              <span className="block font-semibold uppercase text-zinc-500">
                Exchange
              </span>
              <span className="block w-fit text-right font-semibold">
                {profileAndQuote.profile?.exchange}
              </span>
            </li>
          </ul>
        </div>
        <div className="basis-1/2 rounded-md border px-5 pb-7 pt-4">
          <div className="md:hidden xl:block">
            <p className="mb-4 pt-3 text-xs font-semibold uppercase text-zinc-500">
              About {profileAndQuote.profile.name}
            </p>
            <p className="mb-4 hyphens-auto text-justify text-sm leading-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              ullamcorper purus massa, eu vulputate lectus feugiat non. Nunc id
              felis nunc. Curabitur magna nulla, aliquam quis vehicula eu,
              vulputate a est. Donec varius at ipsum sit amet malesuada. Aenean
              pellentesque neque lectus, a mollis ipsum scelerisque non.
              Curabitur facilisis lacus et eleifend semper.
            </p>
          </div>
          <ul className="w-full">
            <li className="flex items-start justify-between border-b py-3 text-xs last:border-b-0 last:pb-1">
              <span className="block w-fit font-semibold uppercase text-zinc-500">
                Country Code
              </span>
              <span className="block w-fit text-right font-semibold">
                {profileAndQuote.profile?.country}
              </span>
            </li>
            <li className="flex items-start justify-between border-b py-3 text-xs last:border-b-0 last:pb-1">
              <span className="block w-fit font-semibold uppercase text-zinc-500">
                IPO Date
              </span>
              <span className="block w-fit text-right font-semibold">
                {new Date(profileAndQuote.profile?.ipo).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </span>
            </li>
            <li className="flex items-start justify-between border-b py-3 text-xs last:border-b-0 last:pb-1">
              <span className="block w-fit font-semibold uppercase text-zinc-500">
                Industry
              </span>
              <span className="block w-fit text-right font-semibold capitalize">
                {profileAndQuote.profile?.finnhubIndustry}
              </span>
            </li>
            <li className="flex items-start justify-between border-b py-3 text-xs last:border-b-0 last:pb-1">
              <span className="block w-fit font-semibold uppercase text-zinc-500">
                Phone
              </span>
              <a
                href={`tel:+${profileAndQuote.profile?.phone}`}
                className="block w-fit text-right font-semibold capitalize"
              >
                {formatPhoneNumber(profileAndQuote.profile?.phone)}
              </a>
            </li>
            <li className="flex items-start justify-between border-b py-3 text-xs last:border-b-0 last:pb-1">
              <span className="block w-fit font-semibold uppercase text-zinc-500">
                Web URL
              </span>
              <a
                href={profileAndQuote.profile?.weburl}
                target="_blank"
                className="block w-fit text-right font-semibold "
              >
                {profileAndQuote.profile?.weburl}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
