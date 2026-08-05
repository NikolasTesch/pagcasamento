"use client";

import { useState, useEffect, useRef } from "react";
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
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Usa requestAnimationFrame em vez de setInterval para evitar
    // re-renders desnecessários quando a aba está em background
    let lastTick = 0;

    const update = (timestamp: number) => {
      if (timestamp - lastTick >= 1000) {
        lastTick = timestamp;
        const remaining = calcTimeLeft();
        setIsComplete(isZero(remaining));
        setTimeLeft(remaining);
      }
      rafRef.current = requestAnimationFrame(update);
    };

    // Atualiza imediatamente
    setTimeLeft(calcTimeLeft());
    rafRef.current = requestAnimationFrame(update);

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  if (isComplete) {
    return (
      <div className="flex items-center justify-center py-2">
        <span className="font-serif text-[18px] md:text-[22px] text-center text-brand-light leading-snug px-2">
          🎉 Chegou o Grande Dia!
        </span>
      </div>
    );
  }

  return (
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
  );
}
