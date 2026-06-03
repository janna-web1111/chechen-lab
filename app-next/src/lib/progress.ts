import type { UserProgress } from "@/types/progress";

export const progressKey = "chechenLab.progress.v1";

export function createEmptyProgress(): UserProgress {
  const now = new Date().toISOString();

  return {
    completedThemes: [],
    studiedCards: [],
    quizResults: {},
    firstVisitAt: now,
    lastVisitAt: now,
  };
}

export function readProgress(): UserProgress {
  if (typeof window === "undefined") return createEmptyProgress();

  try {
    const raw = window.localStorage.getItem(progressKey);
    if (!raw) return createEmptyProgress();

    return {
      ...createEmptyProgress(),
      ...JSON.parse(raw),
      lastVisitAt: new Date().toISOString(),
    };
  } catch {
    return createEmptyProgress();
  }
}

export function writeProgress(progress: UserProgress) {
  window.localStorage.setItem(
    progressKey,
    JSON.stringify({ ...progress, lastVisitAt: new Date().toISOString() }),
  );
}

export function resetProgress() {
  window.localStorage.removeItem(progressKey);
}
