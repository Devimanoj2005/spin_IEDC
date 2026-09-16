/**
 * Shuffles an array randomly using Fisher-Yates algorithm without mutating the original.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Picks N random elements from an array without replacement.
 */
export function getRandomSubarray<T>(array: T[], n: number): T[] {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, n);
}
