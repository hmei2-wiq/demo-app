export type WidthClass = 'compact' | 'regular' | 'wide';

export const REGULAR_FROM = 768;
export const WIDE_FROM = 1100;
export const MAX_CONTENT = 1200;

/** @FR-DSK-01 */
export function widthClass(width: number): WidthClass {
  if (width >= WIDE_FROM) return 'wide';
  if (width >= REGULAR_FROM) return 'regular';
  return 'compact';
}

/** @FR-DSK-02 */
export function navPosition(width: number): 'bottom' | 'left' {
  return widthClass(width) === 'compact' ? 'bottom' : 'left';
}

/** @FR-DSK-03 */
export function gridColumns(width: number): 1 | 2 | 3 {
  const c = widthClass(width);
  return c === 'wide' ? 3 : c === 'regular' ? 2 : 1;
}

/** @FR-DSK-04 */
export function contentWidth(width: number): number {
  return Math.min(width, MAX_CONTENT);
}
