import type { AnswerResult, AppStats, CategoryStats, ErrorPoolEntry, Question } from "@/types";

const ERROR_POOL_KEY = "leben-in-deutschland:error-pool:v1";
const STATS_KEY = "leben-in-deutschland:statistics:v1";

const emptyStats: AppStats = {
  totalAnswered: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  ungradedAnswers: 0,
  byCategory: {},
  wrongQuestionCounts: {}
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getErrorPool(): ErrorPoolEntry[] {
  return readJson<ErrorPoolEntry[]>(ERROR_POOL_KEY, []);
}

export function saveErrorPool(entries: ErrorPoolEntry[]): void {
  writeJson(ERROR_POOL_KEY, entries);
}

export function resetErrorPool(): void {
  saveErrorPool([]);
}

export function recordWrongAnswer(questionId: string): void {
  const pool = getErrorPool();
  const existing = pool.find((entry) => entry.questionId === questionId);
  if (existing) {
    existing.wrongCount += 1;
    existing.correctStreak = 0;
    existing.lastAnsweredAt = new Date().toISOString();
  } else {
    pool.push({
      questionId,
      wrongCount: 1,
      correctStreak: 0,
      lastAnsweredAt: new Date().toISOString()
    });
  }
  saveErrorPool(pool);
}

export function recordCorrectAnswerForPool(questionId: string): void {
  const pool = getErrorPool();
  const next = pool
    .map((entry) =>
      entry.questionId === questionId
        ? {
            ...entry,
            correctStreak: entry.correctStreak + 1,
            lastAnsweredAt: new Date().toISOString()
          }
        : entry
    )
    .filter((entry) => entry.correctStreak < 2);
  saveErrorPool(next);
}

export function getStats(): AppStats {
  return readJson<AppStats>(STATS_KEY, emptyStats);
}

export function resetStats(): void {
  writeJson(STATS_KEY, emptyStats);
}

function nextCategoryStats(stats: AppStats, question: Question): CategoryStats {
  return stats.byCategory[question.category] ?? {
    answered: 0,
    correct: 0,
    incorrect: 0,
    ungraded: 0
  };
}

export function recordAnswer(question: Question, result: AnswerResult): void {
  const stats = getStats();
  const category = nextCategoryStats(stats, question);

  stats.totalAnswered += 1;
  category.answered += 1;

  if (result.isCorrect === true) {
    stats.correctAnswers += 1;
    category.correct += 1;
    recordCorrectAnswerForPool(question.id);
  } else if (result.isCorrect === false) {
    stats.wrongAnswers += 1;
    category.incorrect += 1;
    stats.wrongQuestionCounts[question.id] = (stats.wrongQuestionCounts[question.id] ?? 0) + 1;
    recordWrongAnswer(question.id);
  } else {
    stats.ungradedAnswers += 1;
    category.ungraded += 1;
  }

  stats.byCategory[question.category] = category;
  writeJson(STATS_KEY, stats);
}

export function recordResults(questions: Question[], results: AnswerResult[]): void {
  for (const result of results) {
    const question = questions.find((item) => item.id === result.questionId);
    if (question) {
      recordAnswer(question, result);
    }
  }
}
