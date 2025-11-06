/**
 * Truncate a string to the first n characters and append "..." if truncated.
 * @param str - input string
 * @param n - max characters to keep (default 10)
 */
export function truncate(str: string, n = 10): string {
  // Coerce non-string inputs safely
  if (typeof str !== 'string') {
    str = String(str ?? '');
  }

  // Normalize n
  n = Math.max(0, Math.floor(n));

  if (str.length <= n) {
    return str;
  }

  return str.slice(0, n) + '...';
}