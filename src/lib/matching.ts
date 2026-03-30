import { prisma } from './prisma';
import { calculateCompatibility } from './compatibility';
import { MatchPreference, Gender } from '@prisma/client';

const DAILY_VOTE_LIMIT = 10;
const MAX_ACTIVE_COUPLES = 4;
const TOP_MATCHES = 3;

function isPreferenceCompatible(
  user1Gender: Gender,
  user1Pref: MatchPreference,
  user2Gender: Gender,
  user2Pref: MatchPreference
): boolean {
  const user1WantsUser2 =
    user1Pref === MatchPreference.EVERYONE ||
    (user1Pref === MatchPreference.WOMEN && user2Gender === Gender.FEMALE) ||
    (user1Pref === MatchPreference.MEN && user2Gender === Gender.MALE);

  const user2WantsUser1 =
    user2Pref === MatchPreference.EVERYONE ||
    (user2Pref === MatchPreference.WOMEN && user1Gender === Gender.FEMALE) ||
    (user2Pref === MatchPreference.MEN && user1Gender === Gender.MALE);

  return user1WantsUser2 && user2WantsUser1;
}

export async function runMatchingEngine(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      gender: true,
      matchPreference: true,
      lifePathNumber: true,
      expressionNumber: true,
      soulUrgeNumber: true,
      couplesAsUser1: { where: { isActive: true }, select: { user2Id: true } },
      couplesAsUser2: { where: { isActive: true }, select: { user1Id: true } },
    },
  });

  if (
    !user ||
    !user.gender ||
    !user.matchPreference ||
    user.lifePathNumber == null ||
    user.expressionNumber == null ||
    user.soulUrgeNumber == null
  ) {
    return;
  }

  const alreadyMatchedIds = new Set([
    ...user.couplesAsUser1.map((c) => c.user2Id),
    ...user.couplesAsUser2.map((c) => c.user1Id),
    userId,
  ]);

  const activeCoupleCounts = new Map<string, number>();
  const allActiveCouples = await prisma.couple.findMany({
    where: { isActive: true },
    select: { user1Id: true, user2Id: true },
  });
  for (const c of allActiveCouples) {
    activeCoupleCounts.set(c.user1Id, (activeCoupleCounts.get(c.user1Id) || 0) + 1);
    activeCoupleCounts.set(c.user2Id, (activeCoupleCounts.get(c.user2Id) || 0) + 1);
  }

  const candidates = await prisma.user.findMany({
    where: {
      isActive: true,
      consentGiven: true,
      lifePathNumber: { not: null },
      expressionNumber: { not: null },
      soulUrgeNumber: { not: null },
      gender: { not: null },
      matchPreference: { not: null },
      id: { notIn: Array.from(alreadyMatchedIds) },
    },
  });

  const eligibleCandidates = candidates.filter((candidate) => {
    const activeCoupleCount = activeCoupleCounts.get(candidate.id) || 0;
    if (activeCoupleCount >= MAX_ACTIVE_COUPLES) return false;
    if (!candidate.gender || !candidate.matchPreference) return false;
    return isPreferenceCompatible(
      user.gender!,
      user.matchPreference!,
      candidate.gender,
      candidate.matchPreference
    );
  });

  const scored = eligibleCandidates.map((candidate) => {
    const compat = calculateCompatibility(
      {
        lifePathNumber: user.lifePathNumber!,
        expressionNumber: user.expressionNumber!,
        soulUrgeNumber: user.soulUrgeNumber!,
      },
      {
        lifePathNumber: candidate.lifePathNumber!,
        expressionNumber: candidate.expressionNumber!,
        soulUrgeNumber: candidate.soulUrgeNumber!,
      }
    );
    return { candidate, compat };
  });

  scored.sort((a, b) => b.compat.totalScore - a.compat.totalScore);
  const topMatches = scored.slice(0, TOP_MATCHES);

  for (const match of topMatches) {
    const existing = await prisma.couple.findFirst({
      where: {
        isActive: true,
        OR: [
          { user1Id: userId, user2Id: match.candidate.id },
          { user1Id: match.candidate.id, user2Id: userId },
        ],
      },
    });
    if (existing) continue;

    await prisma.couple.create({
      data: {
        user1Id: userId,
        user2Id: match.candidate.id,
        compatibilityScore: match.compat.totalScore,
        lpScore: match.compat.lpScore,
        expressionScore: match.compat.expressionScore,
        soulUrgeScore: match.compat.soulUrgeScore,
        preferenceType: `${user.gender}-${user.matchPreference}`,
      },
    });
  }
}

export { DAILY_VOTE_LIMIT };
