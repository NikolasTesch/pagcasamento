"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type HtmlTag = "div" | "section" | "article" | "span" | "header" | "footer" | "main" | "aside";

interface ScrollRevealProps {
  delay?: number;
  className?: string;
  as?: HtmlTag;
  children: ReactNode;
}

export default function ScrollReveal({
  delay = 0,
  className = "",
  as: Tag = "div",
  children,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(el);
        }
      },
      {
        rootMargin: "0px 0px -60px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag
      ref={ref as never}
      className={`scroll-reveal ${isVisible ? "scroll-reveal--visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
