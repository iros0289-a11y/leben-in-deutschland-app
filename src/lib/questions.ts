import questionsData from "@/data/questions.json";
import type { Question, QuestionCount } from "@/types";

export const questions = questionsData as Question[];

export const ALL_FILTER = "all";

export function filterLabel(question: Question): string {
  return question.state ? `Bundesland: ${question.state}` : question.category;
}

export function getFilterOptions(source: Question[] = questions): string[] {
  const labels = new Set<string>();
  for (const question of source) {
    labels.add(filterLabel(question));
  }
  return Array.from(labels).sort((a, b) => a.localeCompare(b, "de"));
}

export function filterQuestions(source: Question[], filter: string): Question[] {
  if (filter === ALL_FILTER) {
    return source;
  }
  return source.filter((question) => filterLabel(question) === filter);
}

export function shuffleQuestions(source: Question[]): Question[] {
  const shuffled = [...source];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  return shuffled;
}

export function pickQuestions(source: Question[], count: QuestionCount): Question[] {
  const shuffled = shuffleQuestions(source);
  return count === "all" ? shuffled : shuffled.slice(0, count);
}

export function findOptionText(question: Question, answerId: string | null): string {
  if (!answerId) {
    return "Keine Antwort";
  }
  return question.answers.find((option) => option.id === answerId)?.text ?? "Unbekannte Antwort";
}

export function getGradableQuestions(source: Question[]): Question[] {
  return source.filter((question) => question.isEvaluable && question.correctAnswerId);
}
