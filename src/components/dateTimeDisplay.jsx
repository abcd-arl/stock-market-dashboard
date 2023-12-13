import { useEffect, useState } from "react";

export default function DateTimeDisplay() {
  const [datetime, setDatetime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDatetime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const date = datetime.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const time = datetime.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "numeric",
    second: "numeric",
  });

  return (
    <div className="rounded-lg border bg-gradient-to-r from-willow-gray to-rust-gray text-white">
      <div className="h-full w-full rounded-lg border border-white/90 bg-white/10 px-2 py-4 backdrop-blur-md">
        <div className="m-auto w-fit font-mono text-4xl">{time}</div>
        <div className="m-auto w-fit text-xl font-semibold">{date}</div>
      </div>
    </div>
  );
}
