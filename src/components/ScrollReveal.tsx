"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type HtmlTag = "div" | "section" | "article" | "span" | "header" | "footer" | "main" | "aside";

interface ScrollRevealProps {
  delay?: number;
  className?: string;
  as?: HtmlTag;
  children: ReactNode;
}

/** Observer único compartilhado entre todas as instâncias de ScrollReveal */
let sharedObserver: IntersectionObserver | null = null;
const observers = new Map<Element, () => void>();

function getSharedObserver(): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const callback = observers.get(entry.target);
          if (callback && entry.isIntersecting) {
            callback();
          }
        }
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.1 }
    );
  }
  return sharedObserver;
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

    const observer = getSharedObserver();

    const onReveal = () => {
      setTimeout(() => setIsVisible(true), delay);
      observer.unobserve(el);
      observers.delete(el);
    };

    observers.set(el, onReveal);
    observer.observe(el);

    return () => {
      observer.unobserve(el);
      observers.delete(el);
    };
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
