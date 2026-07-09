"use client";

import { Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type TimerProps = {
  seconds: number;
  running?: boolean;
  onExpire: () => void;
};

export function Timer({ seconds, running = true, onExpire }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!running) {
      return;
    }
    const interval = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(interval);
          onExpire();
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [onExpire, running]);

  const formatted = useMemo(() => {
    const minutes = Math.floor(remaining / 60);
    const nextSeconds = remaining % 60;
    return `${String(minutes).padStart(2, "0")}:${String(nextSeconds).padStart(2, "0")}`;
  }, [remaining]);

  const urgent = remaining <= 300;

  return (
    <div
      className={`inline-flex min-w-28 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold ${
        urgent
          ? "border-coral/30 bg-red-50 text-coral"
          : "border-slate-200 bg-white text-slate-700"
      }`}
      aria-live="polite"
    >
      <Clock className="h-4 w-4" aria-hidden="true" />
      {formatted}
    </div>
  );
}
