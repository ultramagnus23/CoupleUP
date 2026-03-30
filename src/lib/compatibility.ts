// Life Path compatibility matrix (9x9, plus master numbers mapped to base)
// Values represent % compatibility (0-100)
const LP_MATRIX: Record<number, Record<number, number>> = {
  1: { 1: 65, 2: 72, 3: 85, 4: 70, 5: 88, 6: 60, 7: 75, 8: 80, 9: 55 },
  2: { 1: 72, 2: 80, 3: 75, 4: 88, 5: 60, 6: 90, 7: 85, 8: 65, 9: 78 },
  3: { 1: 85, 2: 75, 3: 70, 4: 55, 5: 90, 6: 80, 7: 65, 8: 72, 9: 88 },
  4: { 1: 70, 2: 88, 3: 55, 4: 75, 5: 60, 6: 85, 7: 80, 8: 90, 9: 65 },
  5: { 1: 88, 2: 60, 3: 90, 4: 60, 5: 65, 6: 55, 7: 72, 8: 75, 9: 80 },
  6: { 1: 60, 2: 90, 3: 80, 4: 85, 5: 55, 6: 78, 7: 70, 8: 65, 9: 88 },
  7: { 1: 75, 2: 85, 3: 65, 4: 80, 5: 72, 6: 70, 7: 80, 8: 60, 9: 90 },
  8: { 1: 80, 2: 65, 3: 72, 4: 90, 5: 75, 6: 65, 7: 60, 8: 70, 9: 55 },
  9: { 1: 55, 2: 78, 3: 88, 4: 65, 5: 80, 6: 88, 7: 90, 8: 55, 9: 75 },
};

// Master numbers map to their base for matrix lookup
function normalizeForMatrix(n: number): number {
  if (n === 11) return 2;
  if (n === 22) return 4;
  if (n === 33) return 6;
  return n;
}

function getLifePathScore(lp1: number, lp2: number): number {
  const n1 = normalizeForMatrix(lp1);
  const n2 = normalizeForMatrix(lp2);
  return LP_MATRIX[n1]?.[n2] ?? LP_MATRIX[n2]?.[n1] ?? 65;
}

function getDifferenceScore(n1: number, n2: number): number {
  const diff = Math.abs(n1 - n2);
  if (diff === 0) return 85;
  if (diff === 1) return 80;
  if (diff === 2) return 72;
  if (diff <= 4) return 65;
  return 55;
}

export interface CompatibilityResult {
  lpScore: number;
  expressionScore: number;
  soulUrgeScore: number;
  totalScore: number;
}

export interface UserNumerology {
  lifePathNumber: number;
  expressionNumber: number;
  soulUrgeNumber: number;
}

export function calculateCompatibility(user1: UserNumerology, user2: UserNumerology): CompatibilityResult {
  const lpScore = getLifePathScore(user1.lifePathNumber, user2.lifePathNumber);
  const expressionScore = getDifferenceScore(user1.expressionNumber, user2.expressionNumber);
  const soulUrgeScore = getDifferenceScore(user1.soulUrgeNumber, user2.soulUrgeNumber);

  const totalScore = Math.round(
    lpScore * 0.4 + expressionScore * 0.35 + soulUrgeScore * 0.25
  );

  return { lpScore, expressionScore, soulUrgeScore, totalScore };
}
