export type AnswerResult = 'correct' | 'incorrect' | 'timeout'

export interface ScoreInput {
  result: AnswerResult
  basePoints: number
  currentStreak: number
}

export interface ScoreOutput {
  awardedPoints: number
  nextStreak: number
  multiplier: number
}

export function getMultiplier(streak: number): number {
  if (streak >= 5) return 3
  if (streak >= 3) return 2
  return 1
}

export function computeScore({ result, basePoints, currentStreak }: ScoreInput): ScoreOutput {
  if (result === 'correct') {
    const nextStreak = currentStreak + 1
    const multiplier = getMultiplier(nextStreak)
    return { awardedPoints: basePoints * multiplier, nextStreak, multiplier }
  }
  return { awardedPoints: 0, nextStreak: 0, multiplier: 1 }
}
