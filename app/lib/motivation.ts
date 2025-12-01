// app/lib/motivation.ts

export function getMotivation(streak: number): string {
  if (streak <= 1) {
    return "Let's build momentum — small wins create big results!";
  } else if (streak < 5) {
    return `You're on a ${streak}-day streak. Keep going strong!`;
  } else if (streak < 10) {
    return `${streak} days in a row! You're building unstoppable focus.`;
  } else {
    return `${streak}-day mastery streak! Refraim AI salutes your discipline.`;
  }
}
