import { useState, useEffect } from "react";

export function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time
    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    .replace(" AM", "")
    .replace(" PM", "");
  const dateString = time.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col items-center justify-center text-white font-roboto w-full z-10">
      <p className="text-[14px] font-normal opacity-90 mt-2 mb-0 tracking-wide">
        {dateString}
      </p>
      <h1 className="text-[64px] font-bold tracking-tight leading-none m-0 p-0">
        {timeString}
      </h1>
    </div>
  );
}
