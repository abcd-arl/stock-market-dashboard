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
      <div className="pt-6 2xl:w-[22rem]">
        <div className="hidden pb-2 md:block xl:hidden">
          <div className="mb-4">
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
        <div className="flex flex-col gap-2 md:flex-row xl:flex-col">
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
          <div className="basis-1/2 rounded-md border px-5 py-4">
            <div className="md:hidden xl:block">
              <p className="mb-4">
                <SkeletonLoading className="h-2 w-24" />
              </p>
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

  const infoPartOne = {
    // CURRENCY: profileAndQuote.profile?.currency,
    "PREV CLOSE": profileAndQuote.quote?.c,
    "52-WEEK RANGE": `${basicFinancials.metric["52WeekLow"]} - ${basicFinancials.metric["52WeekHigh"]}`,
    "MARKET CAP": formatMarketCap(
      profileAndQuote.profile?.marketCapitalization,
    ),
    "P/E NORMALIZED ANNUAL": basicFinancials.metric.peNormalizedAnnual,
    // "10-DAY AVG. VOLUME": basicFinancials.metric["10DayAverageTradingVolume"],
    EXCHANGE: profileAndQuote.profile?.exchange,
  };

  const infoPartTwo = {
    "COUNTRY CODE": profileAndQuote.profile?.country,
    "IPO DATE": new Date(profileAndQuote.profile?.ipo).toLocaleDateString(
      undefined,
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    ),
    INDUSTRY: profileAndQuote.profile?.finnhubIndustry,
    PHONE: formatPhoneNumber(profileAndQuote.profile?.phone),
    "WEB URL": profileAndQuote.profile?.weburl,
  };

  return (
    <div className="pt-6 2xl:w-[22rem]">
      <div className="hidden pb-2 md:block xl:hidden">
        <p className="mb-4 text-xs font-semibold uppercase text-zinc-500">
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
      <div className="flex flex-col gap-2 md:flex-row xl:flex-col">
        <div className="basis-1/2 rounded-md border px-5 pb-7 pt-4">
          <ul className="w-full">
            {Object.keys(infoPartOne).map((key) => (
              <li
                key={key}
                className="flex items-start justify-between border-b py-3 text-xs last:border-b-0 last:pb-1"
              >
                <span className="block w-40 font-semibold text-zinc-500">
                  {key}
                </span>
                <span className="block w-fit text-right font-semibold">
                  {infoPartOne[key]}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="basis-1/2 rounded-md border px-5 py-4">
          <div className="md:hidden xl:block">
            <p className="mb-4 text-xs font-semibold uppercase text-zinc-500">
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
            {Object.keys(infoPartTwo).map((key) => (
              <li
                key={key}
                className="flex items-start justify-between border-b py-3 text-xs last:border-b-0 last:pb-1"
              >
                <span className="block w-fit font-semibold text-zinc-500">
                  {key}
                </span>
                <span className="block w-fit text-right font-semibold">
                  {infoPartTwo[key]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
