"use client";

import { ArrowLeft, CheckCircle2, HelpCircle, RotateCcw, XCircle } from "lucide-react";
import { findOptionText } from "@/lib/questions";
import type { AnswerResult, Question } from "@/types";

type ResultPageProps = {
  title: string;
  questions: Question[];
  results: AnswerResult[];
  onBack: () => void;
  onRepeat?: () => void;
};

export function ResultPage({ title, questions, results, onBack, onRepeat }: ResultPageProps) {
  const correct = results.filter((result) => result.isCorrect === true).length;
  const incorrect = results.filter((result) => result.isCorrect === false).length;
  const ungraded = results.filter((result) => result.isCorrect === null).length;
  const gradable = correct + incorrect;
  const percent = gradable > 0 ? Math.round((correct / gradable) * 100) : 0;
  const passMark = Math.ceil(gradable * 0.5);
  const passed = gradable > 0 && correct >= passMark;

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-civic/50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Zur Startseite
        </button>
        {onRepeat ? (
          <button
            type="button"
            onClick={onRepeat}
            className="inline-flex w-fit items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-slate-700"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Wiederholen
          </button>
        ) : null}
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-civic">{title}</p>
        <h1 className="mt-2 text-3xl font-black text-ink">Auswertung</h1>
        <div className="mt-6 grid gap-3 sm:grid-cols-5">
          <Metric label="Richtig" value={correct} tone="text-mint" />
          <Metric label="Falsch" value={incorrect} tone="text-coral" />
          <Metric label="Nicht bewertbar" value={ungraded} tone="text-amberline" />
          <Metric label="Erfolgsquote" value={`${percent}%`} tone="text-civic" />
          <Metric label="Status" value={passed ? "Bestanden" : "Nicht bestanden"} tone={passed ? "text-mint" : "text-coral"} />
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Bewertet werden nur Fragen mit hinterlegter richtiger Antwort. Richtwert: bestanden ab {passMark} von {gradable} bewertbaren Antworten.
        </p>
      </section>

      <section className="mt-6 grid gap-4">
        {results.map((result, index) => {
          const question = questions.find((item) => item.id === result.questionId);
          if (!question) {
            return null;
          }
          return (
            <article key={`${result.questionId}-${index}`} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{question.sourceNumber}</p>
                  <h2 className="mt-1 font-bold text-ink">{question.questionText}</h2>
                </div>
                <StatusIcon result={result.isCorrect} />
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-md bg-slate-50 p-3">
                  <p className="font-semibold text-slate-600">Deine Antwort</p>
                  <p className="mt-1 text-slate-900">{findOptionText(question, result.selectedAnswerId)}</p>
                </div>
                <div className="rounded-md bg-slate-50 p-3">
                  <p className="font-semibold text-slate-600">Richtige Antwort</p>
                  <p className="mt-1 text-slate-900">
                    {question.correctAnswerId ? findOptionText(question, question.correctAnswerId) : "Nicht eindeutig hinterlegt"}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
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

function StatusIcon({ result }: { result: boolean | null }) {
  if (result === true) {
    return <CheckCircle2 className="h-6 w-6 shrink-0 text-mint" aria-label="Richtig" />;
  }
  if (result === false) {
    return <XCircle className="h-6 w-6 shrink-0 text-coral" aria-label="Falsch" />;
  }
  return <HelpCircle className="h-6 w-6 shrink-0 text-amberline" aria-label="Nicht bewertbar" />;
}
