"use client";

import { ArrowLeft, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getErrorPool, resetErrorPool } from "@/lib/storage";
import type { ErrorPoolEntry, Question } from "@/types";
import { PracticeMode } from "./PracticeMode";

type ErrorPoolProps = {
  questions: Question[];
  onExit: () => void;
};

export function ErrorPool({ questions, onExit }: ErrorPoolProps) {
  const [entries, setEntries] = useState<ErrorPoolEntry[]>([]);
  const [practicing, setPracticing] = useState(false);

  function refresh() {
    setEntries(getErrorPool());
  }

  useEffect(() => {
    refresh();
  }, []);

  const errorQuestions = useMemo(() => {
    const byId = new Map(questions.map((question) => [question.id, question]));
    return entries
      .map((entry) => ({
        entry,
        question: byId.get(entry.questionId)
      }))
      .filter((item): item is { entry: ErrorPoolEntry; question: Question } => Boolean(item.question))
      .sort((a, b) => b.entry.wrongCount - a.entry.wrongCount);
  }, [entries, questions]);

  if (practicing) {
    return (
      <PracticeMode
        title="Fehlerpool"
        questions={errorQuestions.map((item) => item.question)}
        onExit={() => {
          setPracticing(false);
          refresh();
        }}
      />
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-civic/50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Zur Startseite
        </button>
        <button
          type="button"
          onClick={() => {
            resetErrorPool();
            refresh();
          }}
          className="inline-flex w-fit items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-coral hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Fehlerpool zurücksetzen
        </button>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-civic">Fehlerpool</p>
        <h1 className="mt-2 text-3xl font-black text-ink">Gezielt wiederholen</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Falsch beantwortete Fragen bleiben hier gespeichert. Wenn du eine Frage zweimal richtig beantwortest,
          wird sie automatisch entfernt.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-bold text-ink">{errorQuestions.length} Fragen im Fehlerpool</p>
          <button
            type="button"
            disabled={!errorQuestions.length}
            onClick={() => setPracticing(true)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ink px-5 font-bold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Fehler wiederholen
          </button>
        </div>
      </section>

      <section className="mt-6 grid gap-3">
        {errorQuestions.length ? (
          errorQuestions.map(({ entry, question }) => (
            <article key={question.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{question.sourceNumber}</p>
                  <h2 className="mt-1 font-bold text-ink">{question.questionText}</h2>
                  <p className="mt-2 text-sm text-slate-600">{question.category}</p>
                </div>
                <div className="rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-coral">
                  {entry.wrongCount}x falsch
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
            Noch keine falsch beantworteten Fragen gespeichert.
          </div>
        )}
      </section>
    </main>
  );
}
