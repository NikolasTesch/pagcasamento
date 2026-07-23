interface FooterProps {
  /** Couple initials displayed in the footer (default "K & L") */
  initials?: string;
  /** Date string displayed in the footer (default "11.10.2026") */
  date?: string;
  /** Phrase displayed in the footer (default "com muito amor") */
  phrase?: string;
  /** Additional class names forwarded to the <footer> element */
  className?: string;
}

export default function Footer({
  initials = "K & L",
  date = "11.10.2026",
  phrase = "com muito amor",
  className = "",
}: FooterProps) {
  return (
    <footer
      className={`h-16 md:h-20 bg-bg-dark flex items-center justify-center ${className}`}
    >
      <span className="text-text-mid text-[12px] tracking-[2px]">
        {initials} · {date} · {phrase}
      </span>
    </footer>
  );
}
