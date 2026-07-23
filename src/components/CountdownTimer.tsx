"use client";

import { useState, useEffect } from "react";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";

const TARGET_DATE = new Date("2026-10-11T15:30:00-03:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(): TimeLeft {
  const now = new Date();
  if (now >= TARGET_DATE) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: differenceInDays(TARGET_DATE, now),
    hours: differenceInHours(TARGET_DATE, now) % 24,
    minutes: differenceInMinutes(TARGET_DATE, now) % 60,
    seconds: differenceInSeconds(TARGET_DATE, now) % 60,
  };
}

function isZero(time: TimeLeft): boolean {
  return time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const update = () => {
      const remaining = calcTimeLeft();
      setIsComplete(isZero(remaining));
      setTimeLeft(remaining);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isComplete) {
    return (
      <section className="countdown-container">
        <div className="countdown-grid !grid-cols-1 md:!grid-cols-1 max-w-[500px]">
          <div className="countdown-block !min-h-[120px] md:!min-h-[150px] flex items-center justify-center">
            <span className="font-serif text-[22px] md:text-[32px] text-center text-brand leading-snug px-2">
              🎉 Chegou o Grande Dia!
            </span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="countdown-container">
      <div className="countdown-grid">
        <div className="countdown-block">
          <span className="countdown-number">
            {String(timeLeft.days).padStart(2, "0")}
          </span>
          <span className="countdown-label">DIAS</span>
        </div>
        <div className="countdown-block">
          <span className="countdown-number">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="countdown-label">HORAS</span>
        </div>
        <div className="countdown-block">
          <span className="countdown-number">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="countdown-label">MINUTOS</span>
        </div>
        <div className="countdown-block">
          <span className="countdown-number">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className="countdown-label">SEGUNDOS</span>
        </div>
      </div>
    </section>
  );
}
