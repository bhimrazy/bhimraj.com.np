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

/**
 * Generates a slug from the given string with a specified maximum length.
 * @param text The string to generate a slug from.
 * @param maxLength The maximum length of the slug. Defaults to 50 if not provided.
 * @returns The slug generated from the input string with the specified maximum length.
 */
export function slugify(text: string, maxLength = 50): string {
  let slug = text
    .toLowerCase() // Convert to lowercase
    .trim() // Trim whitespace
    .replace(/[^a-z0-9\-]/g, "-") // Replace non-alphanumeric characters (except hyphens) with hyphens
    .replace(/\-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^\-|\-$/g, ""); // Remove leading and trailing hyphens

  // Truncate the slug if it exceeds the maximum length
  if (slug.length > maxLength) {
    slug = slug.slice(0, maxLength);
  }

  return slug;
}

/**
 * Extracts headings from HTML content and generates a table of contents.
 * @param content HTML content containing headings.
 * @returns An array of objects containing the level and title of the headings.
 */
export function extractTableOfContents(
  content: string
): { level: number; title: string; slug: string }[] {
  const headings: { level: number; title: string; slug: string }[] = [];
  const pattern = /<h([1-2])>(.*?)<\/h[1-2]>/gi;
  let match;

  while ((match = pattern.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const title = match[2].replace(/<[^>]*>?/gm, ""); // Remove HTML tags from title
    const slug = slugify(title);

    // skip if the title is empty
    if (!title) continue;
    headings.push({ level, title, slug });
  }

  return headings;
}
