import { Link } from "wouter";
import { useRef, useState, useCallback, useMemo } from "react";
import { useLazyGetProfilesAndQuotesQuery } from "../redux/finnhub";
import { SOCKET_URL } from "../App";
import useWebSocket from "react-use-websocket";
import closeButton from "../assets/icons8-close.svg";
import SkeletonLoading from "./skeletonLoading";

export default function WatchList({ symbols, topAndTrendingTickers }) {
  // const { sendJsonMessage, lastJsonMessage } = useWebSocket(SOCKET_URL, {
  //   share: true,
  // });
  const [trades, setTrades] = useState({});
  const [trigger, result] = useLazyGetProfilesAndQuotesQuery();
  // const [symbolsData, setSymbolsData] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [shouldSave, setShouldSave] = useState({
    initial: false,
    final: false,
  });
  const container = useRef(null);

  const symbolsData = {
    MARA: {
      profile: {
        country: "US",
        currency: "USD",
        estimateCurrency: "USD",
        exchange: "NASDAQ NMS - GLOBAL MARKET",
        finnhubIndustry: "Technology",
        ipo: "2014-07-28",
        logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/MARA.svg",
        marketCapitalization: 3731.196074,
        name: "Marathon Digital Holdings Inc",
        phone: "18008041690",
        shareOutstanding: 222.63,
        ticker: "MARA",
        weburl: "https://www.marathondh.com/",
      },
      quote: {
        c: 17.145,
        d: 0.385,
        dp: 2.2971,
        h: 17.24,
        l: 16.42,
        o: 17.24,
        pc: 16.76,
        t: 1702565940,
      },
    },
    T: {
      profile: {
        country: "US",
        currency: "USD",
        estimateCurrency: "USD",
        exchange: "NEW YORK STOCK EXCHANGE, INC.",
        finnhubIndustry: "Telecommunication",
        ipo: "1983-11-21",
        logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/T.svg",
        marketCapitalization: 117617.834776,
        name: "AT&T Inc",
        phone: "12108214105",
        shareOutstanding: 7150.02,
        ticker: "T",
        weburl: "https://www.att.com/",
      },
      quote: {
        c: 16.635,
        d: 0.185,
        dp: 1.1246,
        h: 16.72,
        l: 16.5,
        o: 16.5,
        pc: 16.45,
        t: 1702565945,
      },
    },
    RIOT: {
      profile: {
        country: "US",
        currency: "USD",
        estimateCurrency: "USD",
        exchange: "NASDAQ NMS - GLOBAL MARKET",
        finnhubIndustry: "Technology",
        ipo: "2003-01-23",
        logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/RIOT.svg",
        marketCapitalization: 3147.2950550000005,
        name: "Riot Platforms Inc",
        phone: "13037942000",
        shareOutstanding: 206.52,
        ticker: "RIOT",
        weburl: "https://www.riotplatforms.com/",
      },
      quote: {
        c: 15.3272,
        d: 0.0872,
        dp: 0.5722,
        h: 15.53,
        l: 15.06,
        o: 15.53,
        pc: 15.24,
        t: 1702565945,
      },
    },
    AMZN: {
      profile: {
        country: "US",
        currency: "USD",
        estimateCurrency: "USD",
        exchange: "NASDAQ NMS - GLOBAL MARKET",
        finnhubIndustry: "Retail",
        ipo: "1997-05-15",
        logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/AMZN.svg",
        marketCapitalization: 1538117.1734059998,
        name: "Amazon.com Inc",
        phone: "12062661000",
        shareOutstanding: 10334.03,
        ticker: "AMZN",
        weburl: "https://www.amazon.com/",
      },
      quote: {
        c: 148.693,
        d: -0.147,
        dp: -0.0988,
        h: 150.54,
        l: 148.68,
        o: 149.49,
        pc: 148.84,
        t: 1702565945,
      },
    },
    UBER: {
      profile: {
        country: "US",
        currency: "USD",
        estimateCurrency: "USD",
        exchange: "NEW YORK STOCK EXCHANGE, INC.",
        finnhubIndustry: "Road & Rail",
        ipo: "2019-05-10",
        logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/UBER.svg",
        marketCapitalization: 127525.472334,
        name: "Uber Technologies Inc",
        phone: "14156128582",
        shareOutstanding: 2057.86,
        ticker: "UBER",
        weburl: "https://www.uber.com",
      },
      quote: {
        c: 61.9178,
        d: -0.0522,
        dp: -0.0842,
        h: 62.425,
        l: 61.45,
        o: 62.26,
        pc: 61.97,
        t: 1702565949,
      },
    },
    SOFI: {
      profile: {
        country: "US",
        currency: "USD",
        estimateCurrency: "USD",
        exchange: "NASDAQ NMS - GLOBAL MARKET",
        finnhubIndustry: "Financial Services",
        ipo: "2020-11-30",
        logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/SOFI.svg",
        marketCapitalization: 8571.159119,
        name: "SoFi Technologies Inc",
        phone: "18554567634",
        shareOutstanding: 958.74,
        ticker: "SOFI",
        weburl: "https://www.sofi.com/",
      },
      quote: {
        c: 9.74,
        d: 0.8,
        dp: 8.9485,
        h: 9.7779,
        l: 9.03,
        o: 9.03,
        pc: 8.94,
        t: 1702565953,
      },
    },
    CMCSA: {
      profile: {
        country: "US",
        currency: "USD",
        estimateCurrency: "USD",
        exchange: "NASDAQ NMS - GLOBAL MARKET",
        finnhubIndustry: "Media",
        ipo: "1972-06-29",
        logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/CMCSA.svg",
        marketCapitalization: 175775.220024,
        name: "Comcast Corp",
        phone: "12152861700",
        shareOutstanding: 4025.08,
        ticker: "CMCSA",
        weburl: "https://corporate.comcast.com/",
      },
      quote: {
        c: 44.62,
        d: 0.95,
        dp: 2.1754,
        h: 44.95,
        l: 43.95,
        o: 43.99,
        pc: 43.67,
        t: 1702565980,
      },
    },
    AMD: {
      profile: {
        country: "US",
        currency: "USD",
        estimateCurrency: "USD",
        exchange: "NASDAQ NMS - GLOBAL MARKET",
        finnhubIndustry: "Semiconductors",
        ipo: "1979-10-15",
        logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/AMD.svg",
        marketCapitalization: 223245.797124,
        name: "Advanced Micro Devices Inc",
        phone: "14087494000",
        shareOutstanding: 1615.5,
        ticker: "AMD",
        weburl: "https://www.amd.com/en",
      },
      quote: {
        c: 141.095,
        d: 2.905,
        dp: 2.1022,
        h: 141.56,
        l: 138.58,
        o: 138.79,
        pc: 138.19,
        t: 1702565974,
      },
    },
    PLTR: {
      profile: {
        country: "US",
        currency: "USD",
        estimateCurrency: "USD",
        exchange: "NEW YORK STOCK EXCHANGE, INC.",
        finnhubIndustry: "Technology",
        ipo: "2020-09-30",
        logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/PLTR.svg",
        marketCapitalization: 38884.938554,
        name: "Palantir Technologies Inc",
        phone: "17203583679",
        shareOutstanding: 2174.98,
        ticker: "PLTR",
        weburl: "https://www.palantir.com/",
      },
      quote: {
        c: 18.48,
        d: 0.61,
        dp: 3.4135,
        h: 18.58,
        l: 18.17,
        o: 18.2,
        pc: 17.87,
        t: 1702565985,
      },
    },
    PLUG: {
      profile: {
        country: "US",
        currency: "USD",
        estimateCurrency: "USD",
        exchange: "NASDAQ NMS - GLOBAL MARKET",
        finnhubIndustry: "Electrical Equipment",
        ipo: "1999-10-28",
        logo: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/PLUG.svg",
        marketCapitalization: 2609.714962,
        name: "Plug Power Inc",
        phone: "15187827700",
        shareOutstanding: 605.5,
        ticker: "PLUG",
        weburl: "https://www.plugpower.com/",
      },
      quote: {
        c: 4.8512,
        d: 0.5412,
        dp: 12.5568,
        h: 4.91,
        l: 4.5799,
        o: 4.58,
        pc: 4.31,
        t: 1702565969,
      },
    },
  };

  function addSymbol(e) {
    e.preventDefault();
    const newSymbol = e.target[0].value;
    if (symbols.includes(newSymbol)) return;
    sendJsonMessage({ type: "subscribe", symbol: newSymbol });
    setShouldSave({ initial: true, final: false });
    trigger([newSymbol]);
  }

  const removeSymbol = useCallback(
    (symbol) => {
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
    },
    [symbolsData, topAndTrendingTickers],
  );

  // useEffect(() => {
  //   trigger(symbols);
  //   if (result.isSuccess)
  //     setSymbolsData((prev) => ({ ...prev, ...result.data }));
  //   // symbols.forEach((symbol) => {
  //   //   sendJsonMessage({ type: "subscribe", symbol: symbol });
  //   // });
  // }, [result.isSuccess]);

  // useEffect(() => {
  //   if (result.isFetching && shouldSave.initial)
  //     setShouldSave({ initial: false, final: true });
  //   else if (!result.isFetching && shouldSave.final) {
  //     setShouldSave({ initial: false, final: false });
  //     setSymbolsData((prev) => ({ ...prev, ...result.data }));
  //     setInputValue("");
  //   }
  // }, [result.isFetching, shouldSave.final]);

  // useEffect(() => {
  //   if (lastJsonMessage?.type === "trade") {
  //     const newTrades = { ...trades };
  //     lastJsonMessage.data.forEach((trade) => {
  //       newTrades[trade.s] = trade;
  //     });
  //     setTrades(newTrades);
  //   }
  // }, [lastJsonMessage]);

  return (
    <div className="h-fit w-full rounded-lg border border-gray-300 text-[0.8rem] shadow lg:sticky lg:pb-6 lg:pt-4">
      <div className="hidden items-center justify-between lg:flex lg:flex-col lg:items-start">
        <h2 className="mb-3 w-fit px-4 text-2xl font-bold">Your Watch List</h2>
        <form
          onSubmit={addSymbol}
          className="relative mb-4 flex w-[250px] px-4 lg:w-full"
        >
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
              className="absolute bottom-0 right-5 top-0 cursor-pointer p-2"
            />
          )}
        </form>
      </div>
      <div className="my-1 overflow-x-auto">
        <div
          ref={container}
          className="my-2 ml-2 mr-2.5 flex gap-2 lg:flex-col"
        >
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
            Object.keys(symbolsData).map((symbol) => {
              const name = symbolsData[symbol].profile.name;
              const logo = symbolsData[symbol].profile.logo;
              const close = symbolsData[symbol].quote.pc.toFixed(3);
              const current = trades[symbol]?.p
                ? trades[symbol]?.p.toFixed(3)
                : symbolsData[symbol].quote.c.toFixed(3);
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
            })}
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
    <div className="group relative animate-roll-out rounded px-2 transition-all hover:bg-gray-50">
      <button
        className="absolute -right-1.5 -top-2 hidden group-hover:block"
        onClick={() => removeSymbol(symbol)}
      >
        <img src={closeButton} alt="" className="h-5 w-5" />
      </button>
      <div className="flex w-fit justify-between gap-2 lg:w-full">
        <div className="flex w-full items-center justify-center">
          <div className="mr-3 hidden basis-3.5 text-lg">
            {change < 0 ? (
              <span className="text-red-600">↓</span>
            ) : (
              <span className="text-green-600">↑</span>
            )}
          </div>
          <Link to={`/profile/${symbol}`} className="flex w-full items-center">
            <div className="mr-3 hidden h-7 shrink-0 basis-7 rounded-full bg-gray-200 lg:block">
              <img src={logo} alt={name} className="rounded-full" />
            </div>
            <div className="flex w-fit">
              <p className="font-bold">{symbol}</p>
              <p className="hidden w-36 md:overflow-hidden md:overflow-ellipsis md:whitespace-nowrap lg:hidden xl:block">
                {name}
              </p>
            </div>
          </Link>
        </div>
        <div
          className={`flex w-full text-right font-mono ${
            change < 0 ? "text-red-600" : "text-green-600"
          }`}
        >
          <div key={"current" + current} className="animate-fade-in">
            {current}
            <span className="invisible">&#41;</span>
          </div>
          <p>
            <span>&#40;</span>
            {percentChange}%<span>&#41;</span>
            <span className="hidden">({change})</span>
          </p>
        </div>
      </div>
    </div>
  );
}
