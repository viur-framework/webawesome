/**
 * Escapes regex special characters so a string can be safely used as a literal match inside a RegExp.
 * @param value - The string to escape.
 * @returns The escaped string.
 */
export default function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
