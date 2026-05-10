/**
 * General helper functions
 */

/**
 * Get user initials from name (e.g., "Alex Johnson" → "AJ")
 */
export function getInitials(name: string, maxChars = 2): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, maxChars)
    .join('');
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Delay for a given number of milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + '…';
}

/**
 * Generate a random color from a predefined palette
 */
export function getColorForIndex(index: number): string {
  const colors = [
    '#6d28d9', '#0369a1', '#15803d', '#92400e',
    '#b91c1c', '#7c3aed', '#0891b2', '#059669',
  ];
  return colors[index % colors.length];
}

/**
 * Get background color for a given accent color (lighter version)
 */
export function getLightBgColor(color: string): string {
  const map: Record<string, string> = {
    '#6d28d9': '#ede9fe',
    '#0369a1': '#e0f2fe',
    '#15803d': '#dcfce7',
    '#92400e': '#fef3c7',
    '#b91c1c': '#fee2e2',
    '#7c3aed': '#f5f3ff',
    '#0891b2': '#ecfeff',
    '#059669': '#d1fae5',
  };
  return map[color] || '#f3f4f6';
}

/**
 * Check if running in browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Simple debounce implementation
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

/**
 * Create a typed object.keys
 */
export function typedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * Generate a random ID
 */
export function generateId(length = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
