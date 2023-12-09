import { useEffect, useState } from "react";
import { useLazyGetProfileAndQuoteQuery } from "../redux/finnhub";
import { SOCKET_URL } from "../App";
import useWebSocket from "react-use-websocket";
import closeButton from "../assets/icons8-close.svg";
import SkeletonLoading from "./skeletonLoading";

export default function WatchList({ symbols, topAndTrendingTickers }) {
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(SOCKET_URL, {
    share: true,
  });
  const [trades, setTrades] = useState({});
  const [trigger, result] = useLazyGetProfileAndQuoteQuery();
  const [symbolsData, setSymbolsData] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [animation, setAnimation] = useState(null);
  const [shouldSave, setShouldSave] = useState({
    initial: false,
    final: false,
  });

  function addSymbol(e) {
    e.preventDefault();
    const newSymbol = e.target[0].value.toUpperCase();
    if (symbols.includes(newSymbol)) return;
    sendJsonMessage({ type: "subscribe", symbol: newSymbol });
    setShouldSave({ initial: true, final: false });
    trigger([newSymbol]);
  }

  function removeSymbol(symbol) {
    if (!topAndTrendingTickers.has(symbol)) {
      sendJsonMessage({ type: "unsubscribe", symbol: symbol });
    }

    const newSymbols = Object.keys(symbolsData)
      .filter((key) => key != symbol)
      .reduce((result, key) => {
        result[key] = symbolsData[key];
        return result;
      }, {});
    setSymbolsData(newSymbols);
  }

  useEffect(() => {
    trigger(symbols);
    if (result.isSuccess)
      setSymbolsData((prev) => ({ ...prev, ...result.data }));
    symbols.forEach((symbol) => {
      sendJsonMessage({ type: "subscribe", symbol: symbol });
    });
  }, [result.isSuccess]);

  useEffect(() => {
    if (result.isFetching && shouldSave.initial)
      setShouldSave({ initial: false, final: true });
    else if (!result.isFetching && shouldSave.final) {
      setShouldSave({ initial: false, final: false });
      setSymbolsData((prev) => ({ ...prev, ...result.data }));
      setInputValue("");
    }
  }, [result.isFetching, shouldSave.final]);

  useEffect(() => {
    if (lastJsonMessage?.type === "trade") {
      const newTrades = { ...trades };
      lastJsonMessage.data.forEach((trade) => {
        newTrades[trade.s] = trade;
      });
      setTrades(newTrades);
    }
  }, [lastJsonMessage]);

  return (
    <div className="sticky top-2 w-full rounded-lg border border-gray-300 pb-6 pt-4 text-[0.8rem] shadow">
      <h2 className="mb-3 px-4 text-2xl font-bold">Your Watch List</h2>
      <form onSubmit={addSymbol} className="relative mb-4 flex w-full px-4">
        <input
          type="text"
          value={inputValue}
          placeholder="Add a symbol"
          disabled={result.isFetching}
          onChange={(e) => setInputValue(e.target.value.toUpperCase())}
          className="m-auto block w-full rounded-md border border-gray-300 py-1.5 pl-2 pr-10 text-sm shadow-sm"
        />
        {result.isFetching && !result.isLoading ? (
          <div
            role="status"
            className="absolute bottom-1 right-5 top-1.5 block px-2"
          >
            <svg
              aria-hidden="true"
              className="fill-rust-gray inline h-5 w-5 animate-spin text-gray-200 dark:text-gray-300"
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
            className="absolute bottom-0 right-5 top-0 cursor-pointer p-2"
          />
        )}
      </form>
      <div className="mx-2">
        {result.isLoading &&
          Array(10)
            .fill()
            .map((_, index) => (
              <div key={index} className="flex justify-between px-2 py-3">
                <div className="flex items-center">
                  <SkeletonLoading className="mr-4 h-2.5 w-2.5" />
                  <SkeletonLoading className="mr-3 h-7 w-7 rounded-full" />
                  <div className="flex flex-col gap-2">
                    <SkeletonLoading className="h-2 w-24" />
                    <SkeletonLoading className="h-2 w-32" />
                  </div>
                </div>
                <div className="flex flex-col items-end justify-center gap-2">
                  <div>
                    <SkeletonLoading className="h-2 w-24" />
                  </div>
                  <div className="flex gap-2">
                    <SkeletonLoading className="h-2 w-16" />
                    <SkeletonLoading className="h-2 w-16" />
                  </div>
                </div>
              </div>
            ))}
        {!result.isLoading &&
          Object.keys(symbolsData).map((symbol, index) => {
            const name = symbolsData[symbol].profile.name;
            const logo = symbolsData[symbol].profile.logo;
            const close = symbolsData[symbol].quote.pc.toFixed(3);

            const current = trades[symbol]?.p
              ? trades[symbol]?.p.toFixed(3)
              : symbolsData[symbol].quote.c.toFixed(3);
            const change = (current - close).toFixed(3);
            const percentChange = ((change / close) * 100).toFixed(3);

            return (
              <div
                key={symbol}
                className={`animate-roll-out group relative flex justify-between rounded p-2 transition-all hover:bg-gray-50`}
              >
                <button
                  className="absolute -right-1.5 -top-2 hidden group-hover:block"
                  onClick={() => removeSymbol(symbol)}
                >
                  <img src={closeButton} alt="" className="h-5 w-5" />
                </button>
                <div className="flex items-center justify-center">
                  {change < 0 ? (
                    <div className="mr-3 text-lg text-red-600">↓</div>
                  ) : (
                    <div className="mr-3 text-lg text-green-600">↑</div>
                  )}
                  <img
                    src={logo}
                    alt={name}
                    className="mr-3 h-7 w-7 rounded-full"
                  />
                  <div className="w-full">
                    <p className="font-bold">{symbol}</p>
                    <p className="w-44 overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {name}
                    </p>
                  </div>
                </div>
                <div
                  className={`text-right font-mono ${
                    change < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  <div key={"current" + current} className="animate-fade-in">
                    {current}
                    <span className="invisible">)</span>
                  </div>
                  <p>
                    {percentChange}% ({change})
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
