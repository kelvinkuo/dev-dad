"use client";

import { useState, useEffect } from "react";

export default function RealTimeClock() {
  const [time, setTime] = useState("00:00:00");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds();
      setTime(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="text-6xl md:text-7xl font-mono font-black text-slate-800 tracking-tighter mb-8 md:mb-12 drop-shadow-sm transition-all">
      {time}
    </div>
  );
}
