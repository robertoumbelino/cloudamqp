/**
 * Simulate await time.
 */
export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))
