import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date object or string into a human-readable date string.
 *
 * @param dateOrString - The date object or string to be formatted.
 * @returns A formatted date string in the format "MMM DD, YYYY".
 */
export function formatDate(dateOrString: Date | string): string {
  const date =
    typeof dateOrString === "string" ? new Date(dateOrString) : dateOrString;
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  return date?.toLocaleDateString("en-US", options);
}

/**
 * Calculate the estimated reading time for a given text.
 *
 * @param text - The text for which to calculate the reading time.
 * @param wordsPerMinute - The average number of words a person can read per minute (default: 200).
 * @returns The estimated reading time in a human-readable format.
 */
export function getReadingTime(text: string, wordsPerMinute = 300): string {
  const words = text
    .replace(/<[^>]+>/g, "")
    .trim()
    .split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return minutes <= 1 ? "1 min read" : `${minutes} min read`;
}
