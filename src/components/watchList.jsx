import { useEffect, useState } from "react";
import { Link } from "wouter";
import useWebSocket from "react-use-websocket";
import {
  useLazyGetProfileAndQuoteQuery,
  useGetProfilesAndQuotesQuery,
} from "../redux/finnhub";
import { SOCKET_URL } from "../App";
import closeButton from "../assets/icons8-close.svg";
import SkeletonLoading from "./skeletonLoading";

export default function WatchList({ symbols, topAndTrendingTickers }) {
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(SOCKET_URL, {
    share: true,
  });

  const {
    data: initWatchListItems,
    isFetching: initWatchListItemsIsFetching,
    isSuccess: initWatchListItemsIsSuccess,
    isError: initWatchListItemsIsError,
    error: initWatchListItemsError,
    refetch: refetchInitWatchListItems,
  } = useGetProfilesAndQuotesQuery(symbols);
  const [getProfileAndQuote, receivedProfileAndQuote] =
    useLazyGetProfileAndQuoteQuery();

  const [watchListItems, setWatchListItems] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initWatchListItemsIsSuccess) {
      setWatchListItems(initWatchListItems.available);
      Object.keys(initWatchListItems.available).forEach((symbol) => {
        sendJsonMessage({ type: "subscribe", symbol: symbol });
      });
    }
  }, [initWatchListItemsIsSuccess]);

  useEffect(() => {
    if (receivedProfileAndQuote.data) {
      setWatchListItems((prev) => ({
        ...prev,
        [inputValue]: receivedProfileAndQuote.data,
      }));
      sendJsonMessage({ type: "subscribe", symbol: inputValue });
      setInputValue("");
    }
  }, [receivedProfileAndQuote.data]);

  useEffect(() => {
    if (receivedProfileAndQuote.isError) {
      setErrorMessage(receivedProfileAndQuote.error.data.error);
    }
  }, [receivedProfileAndQuote.isError]);

  const addSymbol = (e) => {
    e.preventDefault();
    if (!(inputValue === "") && !symbols.includes(inputValue)) {
      getProfileAndQuote(inputValue);
    }
  };

  const removeSymbol = (symbol) => {
    if (!topAndTrendingTickers.has(symbol)) {
      sendJsonMessage({ type: "unsubscribe", symbol: symbol });
    }
    setWatchListItems((prev) => {
      const newWatchItems = { ...prev };
      delete newWatchItems[symbol];
      return newWatchItems;
    });
  };

  let content;
  if (initWatchListItemsIsFetching) {
    content = Array(10)
      .fill()
      .map((_, index) => (
        <div
          key={index}
          className="group relative flex items-center justify-between rounded px-2 py-3"
        >
          <div className="flex items-center justify-center gap-3 lg:mr-0">
            <div className="hidden shrink-0 basis-3.5 text-lg lg:block">
              <SkeletonLoading className="mr-1 h-2.5 w-2.5" />
            </div>
            <div className="flex w-fit items-center justify-center">
              <div className="hidden h-7 shrink-0 basis-7 rounded-full lg:block">
                <SkeletonLoading className="mr-3 h-7 w-7 rounded-full" />
              </div>
              <div className="w-full space-y-1.5">
                <SkeletonLoading className="mr-2 h-2 w-16" />
                <SkeletonLoading className="hidden h-2 w-28 xl:block" />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end justify-end gap-1.5">
            <div className="text-right">
              <SkeletonLoading className="h-2 w-24" />
            </div>
            <div className="hidden gap-2 text-right lg:flex">
              <SkeletonLoading className="h-2 w-16" />
              <SkeletonLoading className="h-2 w-16" />
            </div>
          </div>
        </div>
      ));
  } else if (
    initWatchListItemsIsError &&
    initWatchListItemsError.status === 429
  ) {
    content = (
      <div className="flex h-full flex-col items-center justify-center p-2">
        <p className="text-center">
          You have reached the maximum API call limit. Please try again after a
          minute. Click{" "}
          <span
            className="cursor-pointer text-blue-500"
            onClick={refetchInitWatchListItems}
          >
            here
          </span>{" "}
          to refetch.
        </p>
      </div>
    );
  } else {
    content = Object.keys(watchListItems).map((symbol) => {
      const name = watchListItems[symbol].profile.name;
      const logo = watchListItems[symbol].profile.logo;
      const close = watchListItems[symbol].quote.pc.toFixed(3);

      let current = watchListItems[symbol].quote.c.toFixed(3);

      if (lastJsonMessage?.type === "trade") {
        const trade = lastJsonMessage.data.find((trade) => trade.s === symbol);
        if (trade) {
          current = trade.p.toFixed(3);
        }
      }

      const change = (current - close).toFixed(3);
      const percentChange = ((change / close) * 100).toFixed(3);

      return (
        <WatchListItem
          key={symbol}
          symbol={symbol}
          name={name}
          logo={logo}
          current={current}
          change={change}
          percentChange={percentChange}
          removeSymbol={removeSymbol}
        />
      );
    });
  }

  return (
    <div className="w-full rounded-lg border border-gray-300 text-[0.8rem] shadow lg:h-[calc(100%-150px)] lg:pt-4">
      <h2 className="mb-3 hidden px-4 text-2xl font-bold lg:block">
        Your Watch List
      </h2>
      <form onSubmit={addSymbol} className="mb-3 hidden w-full px-4 lg:block">
        <div className="relative flex">
          <input
            type="text"
            value={inputValue}
            placeholder="Add a symbol"
            disabled={
              receivedProfileAndQuote.isFetching || initWatchListItemsIsError
            }
            onChange={(e) => {
              setInputValue(e.target.value.toUpperCase());
              setErrorMessage("");
            }}
            className="m-auto block w-full rounded-md border border-gray-300 py-1.5 pl-2 pr-10 text-sm shadow-sm"
          />
          {receivedProfileAndQuote.isFetching ? (
            <div
              role="status"
              className="absolute bottom-1 right-1 top-1.5 block px-2"
            >
              <svg
                aria-hidden="true"
                className="inline h-5 w-5 animate-spin fill-rust-gray text-gray-200 dark:text-gray-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <input
              type="submit"
              value="GO"
              className="absolute bottom-0 right-1 top-0 cursor-pointer p-2"
            />
          )}
        </div>
        {errorMessage && <p className="mt-1 text-red-500">{errorMessage}</p>}
      </form>
      <div
        className={`overflow-y-auto ${
          errorMessage
            ? "lg:mb-2 lg:h-[calc(100%-115px)]"
            : "lg:mb-2 lg:h-[calc(100%-95px)]"
        }`}
      >
        <div className="mb-2 ml-2 mr-2.5 mt-2 flex gap-4 lg:block lg:gap-0">
          {content}
        </div>
      </div>
    </div>
  );
}

function WatchListItem({
  symbol,
  name,
  logo,
  current,
  change,
  percentChange,
  removeSymbol,
}) {
  return (
    <div className="group relative flex justify-between rounded p-2 transition-all hover:bg-gray-50">
      <button
        className="absolute -right-1.5 -top-2 hidden group-hover:block"
        onClick={() => removeSymbol(symbol)}
      >
        <img src={closeButton} alt="" className="h-5 w-5" />
      </button>
      <div className="flex items-center justify-center gap-3 lg:mr-0">
        <div className="hidden shrink-0 basis-3.5 text-lg lg:block">
          {change < 0 ? (
            <div className="text-red-600">↓</div>
          ) : (
            <div className="text-green-600">↑</div>
          )}
        </div>
        <Link
          to={`/profile/${symbol}`}
          className="flex w-fit items-center justify-center"
        >
          <div className="mr-3 hidden h-7 shrink-0 basis-7 rounded-full bg-gray-300 lg:block">
            <img
              src={logo}
              alt={name}
              className="hidden h-7 w-7 rounded-full lg:inline-block"
            />
          </div>
          <div className="w-full">
            <p className="mr-3 font-bold">{symbol}</p>
            <p className="hidden w-28 overflow-hidden overflow-ellipsis whitespace-nowrap xl:block">
              {name}
            </p>
          </div>
        </Link>
      </div>
      <div
        className={`flex flex-col justify-end font-mono ${
          change < 0 ? "text-red-600" : "text-green-600"
        }`}
      >
        <div key={"current" + current} className="animate-fade-in text-right">
          {current}
          <span className="invisible">&#41;</span>
        </div>
        <p className="hidden text-right lg:block">
          {percentChange}% ({change})
        </p>
      </div>
    </div>
  );
}
