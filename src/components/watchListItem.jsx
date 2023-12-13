import { useMemo } from "react";
import { Link } from "wouter";
import closeButton from "../assets/icons8-close.svg";

export const WatchListItem = useMemo(function WatchListItem({
  symbol,
  name,
  logo,
  current,
  change,
  percentChange,
  removeSymbol,
}) {
  return (
    <div className="group relative flex animate-roll-out justify-between rounded p-2 transition-all hover:bg-gray-50">
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
        <Link
          to={`/profile/${symbol}`}
          className="flex items-center justify-center"
        >
          <img src={logo} alt={name} className="mr-3 h-7 w-7 rounded-full" />
          <div className="w-full">
            <p className="font-bold">{symbol}</p>
            <p className="w-44 overflow-hidden overflow-ellipsis whitespace-nowrap">
              {name}
            </p>
          </div>
        </Link>
      </div>
      <div
        className={`text-right font-mono ${
          change < 0 ? "text-red-600" : "text-green-600"
        }`}
      >
        <div key={"current" + current} className="animate-fade-in">
          {current}
          <span className="invisible">&#41;</span>
        </div>
        <p>
          {percentChange}% ({change})
        </p>
      </div>
    </div>
  );
}, []);
