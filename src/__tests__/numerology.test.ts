import {
  reduceToSingleDigit,
  calculateLifePath,
  calculateExpression,
  calculateSoulUrge,
  calculateNumerologyProfile,
} from '@/lib/numerology';

describe('reduceToSingleDigit', () => {
  it('returns the number as-is if it is a single digit', () => {
    expect(reduceToSingleDigit(5)).toBe(5);
    expect(reduceToSingleDigit(9)).toBe(9);
    expect(reduceToSingleDigit(1)).toBe(1);
  });

  it('preserves master numbers 11, 22, 33', () => {
    expect(reduceToSingleDigit(11)).toBe(11);
    expect(reduceToSingleDigit(22)).toBe(22);
    expect(reduceToSingleDigit(33)).toBe(33);
  });

  it('reduces two-digit non-master numbers to a single digit', () => {
    expect(reduceToSingleDigit(10)).toBe(1);
    expect(reduceToSingleDigit(14)).toBe(5);
    expect(reduceToSingleDigit(29)).toBe(11); // 2+9=11, which is a master number
  });

  it('reduces three-digit numbers correctly', () => {
    expect(reduceToSingleDigit(123)).toBe(6); // 1+2+3=6
    expect(reduceToSingleDigit(999)).toBe(9); // 9+9+9=27, 2+7=9
  });
});

describe('calculateLifePath', () => {
  it('calculates life path for a known date (June 16, 1988)', () => {
    // June=6, 1+6=7 day->7, 1+9+8+8=26->8
    // 6+7+8=21->3
    const dob = new Date(1988, 5, 16); // month is 0-indexed
    expect(calculateLifePath(dob)).toBe(3);
  });

  it('calculates life path for Nov 29, 1975', () => {
    // Nov=11->2, 2+9=11(master)->11->2, 1+9+7+5=22(master)->22->4
    // 2+2+4=8
    const dob = new Date(1975, 10, 29);
    expect(calculateLifePath(dob)).toBe(8);
  });

  it('handles master number preservation in life path', () => {
    // Date that yields a master number
    const dob = new Date(1984, 1, 11); // Feb 11, 1984
    // Feb=2, 1+1=2, 1+9+8+4=22
    // 2+2+22=26->8
    expect(calculateLifePath(dob)).toBe(8);
  });
});

describe('calculateExpression', () => {
  it('calculates expression number for "John"', () => {
    // J=1, O=6, H=8, N=5 => 20 => 2
    expect(calculateExpression('John')).toBe(2);
  });

  it('calculates expression number for "Mary"', () => {
    // M=4, A=1, R=9, Y=7 => 21 => 3
    expect(calculateExpression('Mary')).toBe(3);
  });

  it('ignores non-alphabetic characters', () => {
    expect(calculateExpression('John-Doe')).toBe(calculateExpression('JohnDoe'));
  });

  it('is case insensitive', () => {
    expect(calculateExpression('john')).toBe(calculateExpression('JOHN'));
  });
});

describe('calculateSoulUrge', () => {
  it('calculates soul urge number for "John"', () => {
    // Vowels: O=6 => 6
    expect(calculateSoulUrge('John')).toBe(6);
  });

  it('calculates soul urge number for "Mary"', () => {
    // Vowels: A=1 => 1
    expect(calculateSoulUrge('Mary')).toBe(1);
  });

  it('calculates soul urge for name with multiple vowels', () => {
    // "Maria": A=1, I=9, A=1 => 11 (master number)
    expect(calculateSoulUrge('Maria')).toBe(11);
  });
});

describe('calculateNumerologyProfile', () => {
  it('returns a complete numerology profile', () => {
    const profile = calculateNumerologyProfile('John', new Date(1990, 0, 1));
    expect(profile).toHaveProperty('lifePathNumber');
    expect(profile).toHaveProperty('expressionNumber');
    expect(profile).toHaveProperty('soulUrgeNumber');
    expect(profile.lifePathNumber).toBeGreaterThanOrEqual(1);
    expect(profile.expressionNumber).toBeGreaterThanOrEqual(1);
    expect(profile.soulUrgeNumber).toBeGreaterThanOrEqual(1);
  });
});
