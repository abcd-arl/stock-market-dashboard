import { useLocation } from "wouter";
import { useState } from "react";

export default function SearchBox() {
  const [, setLocation] = useLocation();
  const [inputValue, setInputValue] = useState("");

  return (
    <form
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        const symbol = e.target[0].value;
        setInputValue("");
        setLocation(`/profile/${symbol}`);
      }}
    >
      <div className="absolute inset-y-0 left-0 flex items-center pl-2">
        <svg
          className="h-4 w-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M15.5 15.5l5 5"
          />
          <circle cx="11" cy="11" r="8" />
        </svg>
      </div>
      <input
        className="block w-full rounded-md border border-gray-300 bg-transparent py-2 pl-8 pr-2 text-sm shadow focus:border-zinc-500 focus:ring-zinc-500"
        type="text"
        placeholder="Search a symbol"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value.toUpperCase())}
      />
    </form>
  );
}
