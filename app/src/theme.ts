export const colors = {
  leaf: '#1E7A4C',
  ink: '#14211B',
  cream: '#FAF7F0',
  special: '#C8372D',
  muted: '#5C6B63',
  line: '#E3DED2',
  white: '#FFFFFF',
};

/** @NFR-A11Y-01 minimum touch target in points. */
export const MIN_TARGET = 44;

export const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

/** Screen-reader friendly price, e.g. "3 dollars 50". */
export const spokenMoney = (cents: number) => {
  const d = Math.floor(cents / 100);
  const c = cents % 100;
  return c === 0 ? `${d} dollars` : `${d} dollars ${c}`;
};
