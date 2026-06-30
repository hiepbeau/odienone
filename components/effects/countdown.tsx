"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimeUnit {
  label: string;
  value: number;
}

function calculateTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function getVietnamTime(): Pick<TimeLeft, "hours" | "minutes" | "seconds"> {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);

  return {
    hours: get("hour"),
    minutes: get("minute"),
    seconds: get("second"),
  };
}

interface CountdownProps {
  targetDate?: string;
}

export function Countdown({ targetDate = "2026-07-01T00:00:00+07:00" }: CountdownProps) {
  const [hasReachedTarget, setHasReachedTarget] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [currentTime, setCurrentTime] = useState(getVietnamTime);

  useEffect(() => {
    const target = new Date(targetDate);

    const tick = () => {
      const reached = target.getTime() <= Date.now();
      setHasReachedTarget(reached);

      if (reached) {
        setCurrentTime(getVietnamTime());
      } else {
        setTimeLeft(calculateTimeLeft(target));
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units: TimeUnit[] = hasReachedTarget
    ? [
        { label: "Giờ", value: currentTime.hours },
        { label: "Phút", value: currentTime.minutes },
        { label: "Giây", value: currentTime.seconds },
      ]
    : [
        { label: "Ngày", value: timeLeft.days },
        { label: "Giờ", value: timeLeft.hours },
        { label: "Phút", value: timeLeft.minutes },
        { label: "Giây", value: timeLeft.seconds },
      ];

  return (
    <div className="flex flex-col items-center gap-3">
      {hasReachedTarget && (
        <p className="text-sm text-muted-foreground font-medium">Giờ hiện tại</p>
      )}
      <div className="flex gap-3 sm:gap-4 justify-center">
        {units.map((unit, i) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card flex flex-col items-center min-w-[4rem] sm:min-w-[5rem] px-3 py-4"
          >
            <span className="text-2xl sm:text-3xl font-bold text-gradient tabular-nums">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-xs text-muted-foreground mt-1">{unit.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
