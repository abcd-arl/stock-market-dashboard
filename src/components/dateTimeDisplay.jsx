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
    <div className="to-rust-gray from-willow-gray rounded-lg border bg-gradient-to-r text-white">
      <div className="h-full w-full rounded-lg border border-white/90 bg-white/10 px-2 py-3 backdrop-blur-md">
        <div className="m-auto w-fit font-mono text-2xl">{time}</div>
        <div className="m-auto w-fit text-base font-bold">{date}</div>
      </div>
    </div>
  );
}
