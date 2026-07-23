"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  /** Navigation items rendered on desktop (left side) */
  items: NavItem[];
  /** When set, the item whose `href` matches this value is rendered as plain text (current page indicator) */
  activeHref?: string;
  /** Monogram displayed in the center (default "K & L") */
  initials?: string;
  /** Slot rendered on the right side of the navbar */
  rightSlot?: React.ReactNode;
}

function getSectionId(href: string): string | null {
  const match = href.match(/#(.+)/);
  return match ? match[1] : null;
}

export default function Navbar({
  items,
  activeHref,
  initials = "K & L",
  rightSlot,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = "";
  }, []);

  // Trava/destrava scroll do body quando menu abre/fecha
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // IntersectionObserver para destacar seção ativa (T009)
  useEffect(() => {
    const sectionIds = items
      .map((item) => getSectionId(item.href))
      .filter(Boolean) as string[];

    if (sectionIds.length === 0) return;

    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: "-40% 0px -55% 0px",
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [items]);

  const isActive = (href: string) => {
    const sectionId = getSectionId(href);
    if (sectionId && activeSection === sectionId) return true;
    return href === activeHref;
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-elegant px-5 md:px-20 h-16 md:h-20 flex items-center justify-between">
        {/* Desktop: links à esquerda */}
        <div className="hidden md:flex items-center gap-10">
          {items.map((item) =>
            isActive(item.href) ? (
              <span
                key={item.href}
                className="text-brand text-[13px] tracking-[1.5px]"
              >
                {item.label}
              </span>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-text-mid text-[13px] tracking-[1.5px] hover:text-brand transition"
              >
                {item.label}
              </Link>
            ),
          )}
        </div>

        {/* Mobile: hamburguer */}
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="md:hidden relative z-50 p-2 -ml-2 text-text-dark hover:text-brand transition-colors"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          <div className="relative w-5 h-5">
            <span
              className={`absolute left-0 top-1/2 block h-[1.5px] w-5 bg-current transition-all duration-300 ${
                isMenuOpen
                  ? "rotate-45 translate-y-0"
                  : "-translate-y-[8px]"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 block h-[1.5px] w-5 bg-current transition-all duration-300 ${
                isMenuOpen ? "opacity-0 translate-x-2" : "translate-y-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 block h-[1.5px] w-5 bg-current transition-all duration-300 ${
                isMenuOpen
                  ? "-rotate-45 translate-y-0"
                  : "translate-y-[8px]"
              }`}
            />
          </div>
        </button>

        <span className="font-serif text-[20px] md:text-[22px] tracking-[5px] md:tracking-[6px] text-text-dark absolute left-1/2 -translate-x-1/2">
          {initials}
        </span>

        {rightSlot}
      </nav>

      {/* Overlay + painel mobile */}
      {isMenuOpen && (
        <>
          <div
            className="mobile-menu-overlay"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div className="mobile-menu-panel">
            {items.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`text-[14px] tracking-[2px] py-3 border-b border-elegant transition ${
                  isActive(item.href)
                    ? "text-brand"
                    : "text-text-dark hover:text-brand"
                }`}
                style={{
                  animation: `slideDown 0.3s ease-out ${index * 0.08}s forwards`,
                  opacity: 0,
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
