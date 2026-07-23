/**
 * Merge class names, filtering out falsy values.
 * Similar to clsx/classnames but minimal.
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format a Date instance to Brazilian Portuguese long-date format.
 * Example: "22 de julho de 2026"
 */
export function formatDateBR(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
