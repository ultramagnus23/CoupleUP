// Pythagorean numerology chart
const PYTHAGOREAN_CHART: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);
const MASTER_NUMBERS = new Set([11, 22, 33]);

function sumDigits(n: number): number {
  return String(n)
    .split('')
    .reduce((sum, d) => sum + parseInt(d, 10), 0);
}

export function reduceToSingleDigit(n: number): number {
  if (MASTER_NUMBERS.has(n)) return n;
  while (n > 9 && !MASTER_NUMBERS.has(n)) {
    n = sumDigits(n);
  }
  return n;
}

export function calculateLifePath(dateOfBirth: Date): number {
  const month = dateOfBirth.getMonth() + 1;
  const day = dateOfBirth.getDate();
  const year = dateOfBirth.getFullYear();

  const monthReduced = reduceToSingleDigit(sumDigits(month));
  const dayReduced = reduceToSingleDigit(sumDigits(day));
  const yearReduced = reduceToSingleDigit(sumDigits(year));

  return reduceToSingleDigit(monthReduced + dayReduced + yearReduced);
}

export function calculateExpression(name: string): number {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const total = letters.reduce((sum, letter) => sum + (PYTHAGOREAN_CHART[letter] || 0), 0);
  return reduceToSingleDigit(total);
}

export function calculateSoulUrge(name: string): number {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const vowels = letters.filter((l) => VOWELS.has(l));
  const total = vowels.reduce((sum, letter) => sum + (PYTHAGOREAN_CHART[letter] || 0), 0);
  return reduceToSingleDigit(total);
}

export interface NumerologyProfile {
  lifePathNumber: number;
  expressionNumber: number;
  soulUrgeNumber: number;
}

export function calculateNumerologyProfile(name: string, dateOfBirth: Date): NumerologyProfile {
  return {
    lifePathNumber: calculateLifePath(dateOfBirth),
    expressionNumber: calculateExpression(name),
    soulUrgeNumber: calculateSoulUrge(name),
  };
}

export const LIFE_PATH_DESCRIPTIONS: Record<number, string> = {
  1: 'The Leader — independent, driven, and a natural pioneer',
  2: 'The Peacemaker — sensitive, cooperative, and deeply intuitive',
  3: 'The Creator — expressive, joyful, and socially magnetic',
  4: 'The Builder — disciplined, loyal, and grounded in reality',
  5: 'The Adventurer — free-spirited, curious, and adaptable',
  6: 'The Nurturer — caring, responsible, and family-oriented',
  7: 'The Seeker — introspective, analytical, and spiritually aware',
  8: 'The Achiever — ambitious, authoritative, and materially focused',
  9: 'The Humanitarian — compassionate, idealistic, and globally minded',
  11: 'The Visionary — highly intuitive, inspirational, and spiritually elevated',
  22: 'The Master Builder — practical visionary with the power to create lasting change',
  33: 'The Master Teacher — deeply compassionate guide with a mission to uplift humanity',
};
