"use client";

import { ArrowLeft, ArrowRight, Flag } from "lucide-react";
import { useCallback, useState } from "react";
import { recordResults } from "@/lib/storage";
import type { AnswerResult, Question } from "@/types";
import { QuestionCard } from "./QuestionCard";
import { ResultPage } from "./ResultPage";
import { Timer } from "./Timer";

type ExamModeProps = {
  questions: Question[];
  onExit: () => void;
};

const EXAM_SECONDS = 60 * 60;

export function ExamMode({ questions, onExit }: ExamModeProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<AnswerResult[] | null>(null);

  const current = questions[index];

  const finishExam = useCallback(() => {
    const finalResults = questions.map((question) => {
      const selectedAnswerId = answers[question.id] ?? null;
      return {
        questionId: question.id,
        selectedAnswerId,
        correctAnswerId: question.correctAnswerId,
        isCorrect: question.correctAnswerId ? selectedAnswerId === question.correctAnswerId : null
      };
    });
    recordResults(questions, finalResults);
    setResults(finalResults);
  }, [answers, questions]);

  if (!questions.length) {
    return (
      <ResultPage title="Prüfungsmodus" questions={[]} results={[]} onBack={onExit} />
    );
  }

  if (results) {
    return <ResultPage title="Prüfungsmodus" questions={questions} results={results} onBack={onExit} />;
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-civic/50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Abbrechen
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold text-slate-600">
            Frage {index + 1} von {questions.length}
          </p>
          <Timer seconds={EXAM_SECONDS} onExpire={finishExam} />
        </div>
      </div>

      <QuestionCard
        question={current}
        selectedAnswerId={answers[current.id] ?? null}
        locked={false}
        onSelect={(answerId) => setAnswers((items) => ({ ...items, [current.id]: answerId }))}
      />

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
            className="min-h-11 rounded-md border border-slate-200 bg-white px-4 font-bold text-slate-700 hover:border-civic/50 disabled:cursor-not-allowed disabled:text-slate-300"
          >
            Zurück
          </button>
          <button
            type="button"
            disabled={index >= questions.length - 1}
            onClick={() => setIndex((value) => Math.min(questions.length - 1, value + 1))}
            className="inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 font-bold text-slate-700 hover:border-civic/50 disabled:cursor-not-allowed disabled:text-slate-300"
          >
            Weiter
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          onClick={finishExam}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ink px-5 font-bold text-white hover:bg-slate-700"
        >
          <Flag className="h-4 w-4" aria-hidden="true" />
          Prüfung beenden
        </button>
      </div>
    </main>
  );
}
