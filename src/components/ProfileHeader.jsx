import { useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { SOCKET_URL } from "../App";

export default function ProfileHeader({ symbol, data }) {
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    SOCKET_URL,
    { share: true },
  );

  useEffect(() => {
    if (readyState === 1) {
      sendJsonMessage({ type: "subscribe", symbol: symbol });
    }
  }, [symbol, readyState]);

  const high = data.quote.h.toFixed(2);
  const low = data.quote.l.toFixed(2);
  const open = data.quote.o.toFixed(2);
  const close = data.quote.pc.toFixed(2);

  let current = data.quote.c.toFixed(2);

  if (lastJsonMessage?.type === "trade") {
    const trade = lastJsonMessage.data.find((trade) => trade.s === symbol);
    if (trade) {
      current = trade.p.toFixed(2);
    }
  }

  const change = (current - close).toFixed(2);
  const percentChange = ((change / close) * 100).toFixed(2);

  return (
    <div className="ml-7 w-full">
      <div className="mb-2.5 flex items-end gap-1.5">
        <h1 className="text-xl font-bold">{symbol}</h1>
        <h2 className="text-xl md:text-xl">{data.profile.name}</h2>
      </div>
      <div className="font-mono text-sm">
        <div className="mb-0.5 flex items-end gap-2">
          <div className="text-3xl font-bold sm:text-5xl xl:text-4xl 2xl:text-5xl">
            {current}
            <span className="font-sans"> USD</span>
          </div>
          <div
            className={`text-2xl ${
              change > 0 ? "text-green-700" : "text-red-700"
            } `}
          >
            {change > 0 ? "+" : ""}
            {change} ({change > 0 ? "+" : ""}
            {percentChange}%)
          </div>
        </div>
        <div className="flex gap-2.5 text-xs sm:text-sm">
          <div>
            <span className="font-sans text-zinc-500">Low - High: </span>
            {low}-{high}
          </div>
          <div>
            <span className="font-sans text-zinc-500">Open: </span>
            {open}
          </div>
          <div>
            <span className="font-sans text-zinc-500">Prev. Close: </span>
            {close}
          </div>
        </div>
      </div>
    </div>
  );
}
