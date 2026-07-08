"use client";

import { ArrowLeft, BarChart3, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getStats, resetStats } from "@/lib/storage";
import type { AppStats, Question } from "@/types";
import { ProgressBar } from "./ProgressBar";

type StatisticsPageProps = {
  questions: Question[];
  onExit: () => void;
};

const emptyStats: AppStats = {
  totalAnswered: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  ungradedAnswers: 0,
  byCategory: {},
  wrongQuestionCounts: {}
};

export function StatisticsPage({ questions, onExit }: StatisticsPageProps) {
  const [stats, setStats] = useState<AppStats>(emptyStats);

  function refresh() {
    setStats(getStats());
  }

  useEffect(() => {
    refresh();
  }, []);

  const successRate = stats.correctAnswers + stats.wrongAnswers > 0
    ? Math.round((stats.correctAnswers / (stats.correctAnswers + stats.wrongAnswers)) * 100)
    : 0;
  const missingQuestions = questions.filter((question) => !question.isEvaluable).length;

  const categoryRows = useMemo(
    () =>
      Object.entries(stats.byCategory)
        .map(([category, value]) => ({
          category,
          ...value,
          rate: value.correct + value.incorrect > 0 ? Math.round((value.correct / (value.correct + value.incorrect)) * 100) : 0
        }))
        .sort((a, b) => a.category.localeCompare(b.category, "de")),
    [stats.byCategory]
  );

  const frequentWrong = useMemo(() => {
    const byId = new Map(questions.map((question) => [question.id, question]));
    return Object.entries(stats.wrongQuestionCounts)
      .map(([questionId, count]) => ({ question: byId.get(questionId), count }))
      .filter((item): item is { question: Question; count: number } => Boolean(item.question))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [questions, stats.wrongQuestionCounts]);

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
            resetStats();
            refresh();
          }}
          className="inline-flex w-fit items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-coral hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Statistik zurücksetzen
        </button>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-7 w-7 text-civic" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-civic">Statistik</p>
            <h1 className="text-3xl font-black text-ink">Dein Fortschritt</h1>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-5">
          <Metric label="Beantwortet" value={stats.totalAnswered} tone="text-ink" />
          <Metric label="Richtig" value={stats.correctAnswers} tone="text-mint" />
          <Metric label="Falsch" value={stats.wrongAnswers} tone="text-coral" />
          <Metric label="Nicht bewertbar" value={stats.ungradedAnswers} tone="text-amberline" />
          <Metric label="Quote" value={`${successRate}%`} tone="text-civic" />
        </div>
        <p className="mt-4 text-sm font-semibold text-amber-900">
          {missingQuestions} Fragen im Katalog haben noch keine hinterlegte richtige Lösung.
        </p>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-black text-ink">Fortschritt nach Bereichen</h2>
          <div className="mt-5 grid gap-4">
            {categoryRows.length ? (
              categoryRows.map((row) => (
                <div key={row.category}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="font-bold text-slate-800">{row.category}</p>
                    <p className="text-sm font-semibold text-slate-600">
                      {row.correct}/{row.correct + row.incorrect} richtig
                    </p>
                  </div>
                  <ProgressBar value={row.rate} tone="green" />
                </div>
              ))
            ) : (
              <p className="text-slate-600">Noch keine beantworteten Fragen.</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-black text-ink">Häufig falsch beantwortet</h2>
          <div className="mt-5 grid gap-3">
            {frequentWrong.length ? (
              frequentWrong.map(({ question, count }) => (
                <article key={question.id} className="rounded-md bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{question.sourceNumber}</p>
                  <p className="mt-1 font-bold text-ink">{question.questionText}</p>
                  <p className="mt-2 text-sm font-semibold text-coral">{count}x falsch</p>
                </article>
              ))
            ) : (
              <p className="text-slate-600">Noch keine Fehler gespeichert.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value, tone }: { label: string; value: number | string; tone: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className={`text-2xl font-black ${tone}`}>{value}</p>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </div>
  );
}
