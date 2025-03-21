/**
 * Combines multiple class names into a single string.
 * Filters out falsy values.
 * 
 * @param classes - An array of class names.
 * @returns A single string with all class names combined.
 */
export function cn(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}