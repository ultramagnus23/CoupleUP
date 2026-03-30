import { calculateCompatibility } from '@/lib/compatibility';

describe('calculateCompatibility', () => {
  it('returns a compatibility result with all required fields', () => {
    const result = calculateCompatibility(
      { lifePathNumber: 1, expressionNumber: 3, soulUrgeNumber: 5 },
      { lifePathNumber: 2, expressionNumber: 4, soulUrgeNumber: 6 }
    );
    expect(result).toHaveProperty('lpScore');
    expect(result).toHaveProperty('expressionScore');
    expect(result).toHaveProperty('soulUrgeScore');
    expect(result).toHaveProperty('totalScore');
  });

  it('calculates LP score from the matrix for known pairs', () => {
    // LP 1 vs LP 5 should be 88 from the matrix
    const result = calculateCompatibility(
      { lifePathNumber: 1, expressionNumber: 5, soulUrgeNumber: 5 },
      { lifePathNumber: 5, expressionNumber: 5, soulUrgeNumber: 5 }
    );
    expect(result.lpScore).toBe(88);
  });

  it('gives highest expression score when numbers are equal', () => {
    const result = calculateCompatibility(
      { lifePathNumber: 3, expressionNumber: 7, soulUrgeNumber: 2 },
      { lifePathNumber: 3, expressionNumber: 7, soulUrgeNumber: 2 }
    );
    expect(result.expressionScore).toBe(85);
    expect(result.soulUrgeScore).toBe(85);
  });

  it('calculates total score as weighted average', () => {
    const result = calculateCompatibility(
      { lifePathNumber: 1, expressionNumber: 1, soulUrgeNumber: 1 },
      { lifePathNumber: 1, expressionNumber: 1, soulUrgeNumber: 1 }
    );
    // LP 1v1=65, expr 0diff=85, soul 0diff=85
    // Total = round(65*0.4 + 85*0.35 + 85*0.25)
    // = round(26 + 29.75 + 21.25) = round(77) = 77
    expect(result.totalScore).toBe(77);
  });

  it('maps master number 11 to LP 2 for matrix lookup', () => {
    const withMaster = calculateCompatibility(
      { lifePathNumber: 11, expressionNumber: 5, soulUrgeNumber: 5 },
      { lifePathNumber: 1, expressionNumber: 5, soulUrgeNumber: 5 }
    );
    const withBase = calculateCompatibility(
      { lifePathNumber: 2, expressionNumber: 5, soulUrgeNumber: 5 },
      { lifePathNumber: 1, expressionNumber: 5, soulUrgeNumber: 5 }
    );
    expect(withMaster.lpScore).toBe(withBase.lpScore);
  });

  it('scores are always between 0 and 100', () => {
    for (let lp1 = 1; lp1 <= 9; lp1++) {
      for (let lp2 = 1; lp2 <= 9; lp2++) {
        const result = calculateCompatibility(
          { lifePathNumber: lp1, expressionNumber: lp1, soulUrgeNumber: lp1 },
          { lifePathNumber: lp2, expressionNumber: lp2, soulUrgeNumber: lp2 }
        );
        expect(result.totalScore).toBeGreaterThanOrEqual(0);
        expect(result.totalScore).toBeLessThanOrEqual(100);
      }
    }
  });
});
