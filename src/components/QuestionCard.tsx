"use client";

import { CheckCircle2, HelpCircle, ImageIcon, XCircle } from "lucide-react";
import type { Question } from "@/types";

type QuestionCardProps = {
  question: Question;
  selectedAnswerId: string | null;
  showFeedback?: boolean;
  locked?: boolean;
  onSelect: (answerId: string) => void;
};

function optionState(question: Question, optionId: string, selectedAnswerId: string | null, showFeedback: boolean) {
  if (!showFeedback) {
    return selectedAnswerId === optionId
      ? "border-civic bg-blue-50 text-civic"
      : "border-slate-200 bg-white text-slate-800 hover:border-civic/50 hover:bg-blue-50/50";
  }
  if (!question.isEvaluable) {
    return selectedAnswerId === optionId
      ? "border-amberline bg-amber-50 text-amber-900"
      : "border-slate-200 bg-white text-slate-700";
  }
  if (optionId === question.correctAnswerId) {
    return "border-mint bg-emerald-50 text-emerald-950";
  }
  if (selectedAnswerId === optionId) {
    return "border-coral bg-red-50 text-red-950";
  }
  return "border-slate-200 bg-white text-slate-700";
}

export function QuestionCard({
  question,
  selectedAnswerId,
  showFeedback = false,
  locked = false,
  onSelect
}: QuestionCardProps) {
  const answered = Boolean(selectedAnswerId);
  const isCorrect =
    question.correctAnswerId && selectedAnswerId
      ? selectedAnswerId === question.correctAnswerId
      : null;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{question.sourceNumber}</p>
          <p className="mt-1 text-sm text-slate-600">
            {question.subcategory} · PDF-Seite {question.sourcePage}
          </p>
        </div>
        {!question.isEvaluable ? (
          <span className="inline-flex w-fit items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            Keine eindeutige Lösung
          </span>
        ) : null}
      </div>

      <h2 className="text-xl font-bold leading-snug text-ink sm:text-2xl">{question.questionText}</h2>

      {question.image ? (
        <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2 text-xs font-semibold uppercase text-slate-500">
            <ImageIcon className="h-4 w-4" aria-hidden="true" />
            Bild zur Aufgabe
          </div>
          <img
            src={question.image}
            alt={`Bild zu ${question.sourceNumber}`}
            className="mx-auto max-h-[420px] w-full object-contain p-3"
          />
        </div>
      ) : null}

      <div className="mt-6 grid gap-3">
        {question.answers.map((option, index) => (
          <button
            key={option.id}
            type="button"
            disabled={locked}
            onClick={() => onSelect(option.id)}
            className={`flex min-h-14 w-full items-start gap-3 rounded-lg border p-4 text-left transition ${optionState(
              question,
              option.id,
              selectedAnswerId,
              showFeedback
            )} ${locked ? "cursor-default" : "cursor-pointer"}`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current text-sm font-bold">
              {index + 1}
            </span>
            <span className="pt-0.5 text-base leading-relaxed">{option.text}</span>
          </button>
        ))}
      </div>

      {showFeedback && answered ? (
        <div
          className={`mt-5 flex items-start gap-3 rounded-lg border p-4 ${
            isCorrect === true
              ? "border-emerald-200 bg-emerald-50 text-emerald-950"
              : isCorrect === false
                ? "border-red-200 bg-red-50 text-red-950"
                : "border-amber-200 bg-amber-50 text-amber-950"
          }`}
        >
          {isCorrect === true ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          ) : isCorrect === false ? (
            <XCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          ) : (
            <HelpCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          )}
          <div>
            <p className="font-semibold">
              {isCorrect === true
                ? "Richtig"
                : isCorrect === false
                  ? "Leider falsch"
                  : "Nicht bewertbar"}
            </p>
            <p className="mt-1 text-sm">
              {question.correctAnswerId
                ? `Richtige Antwort: ${
                    question.answers.find((option) => option.id === question.correctAnswerId)?.text
                  }`
                : "Im PDF ist keine richtige Antwort eindeutig markiert. Diese Frage wird nicht als falsch gewertet."}
            </p>
          </div>
        </div>
      ) : null}
    </article>
  );
}
