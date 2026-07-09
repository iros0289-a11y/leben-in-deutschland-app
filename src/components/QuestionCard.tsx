"use client";

import { CheckCircle2, Globe2, HelpCircle, ImageIcon, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { translateToTurkish } from "@/lib/translate";
import type { Question } from "@/types";

type QuestionCardProps = {
  question: Question;
  selectedAnswerId: string | null;
  showFeedback?: boolean;
  locked?: boolean;
  onSelect: (answerId: string) => void;
};

type TurkishText = {
  question: string;
  answers: string[];
  explanation: string;
};

function optionState(question: Question, optionId: string, selectedAnswerId: string | null, showFeedback: boolean) {
  if (!showFeedback) {
    return selectedAnswerId === optionId
      ? "border-civic bg-teal-50 text-civic"
      : "border-slate-200 bg-white text-slate-800 hover:border-civic/50 hover:bg-teal-50/60";
  }
  if (optionId === question.correctAnswerId) {
    return "border-mint bg-emerald-50 text-emerald-950";
  }
  if (selectedAnswerId === optionId) {
    return "border-coral bg-red-50 text-red-950";
  }
  return "border-slate-200 bg-white text-slate-700";
}

function fallbackExplanation(question: Question): string {
  const correct = question.answers.find((answer) => answer.id === question.correctAnswerId)?.text ?? "";
  return question.explanation || `Richtig ist „${correct}“. Diese Antwort entspricht dem offiziellen BAMF-Fragenkatalog.`;
}

export function QuestionCard({
  question,
  selectedAnswerId,
  showFeedback = false,
  locked = false,
  onSelect
}: QuestionCardProps) {
  const [showTurkish, setShowTurkish] = useState(false);
  const [turkish, setTurkish] = useState<TurkishText | null>(null);
  const [loadingTranslation, setLoadingTranslation] = useState(false);
  const [translationError, setTranslationError] = useState(false);

  const answered = Boolean(selectedAnswerId);
  const isCorrect =
    question.correctAnswerId && selectedAnswerId
      ? selectedAnswerId === question.correctAnswerId
      : null;
  const correctAnswer = question.answers.find((answer) => answer.id === question.correctAnswerId)?.text ?? "";
  const explanation = fallbackExplanation(question);

  async function toggleTurkish() {
    if (showTurkish) {
      setShowTurkish(false);
      return;
    }
    setShowTurkish(true);
    if (turkish || loadingTranslation) {
      return;
    }
    setLoadingTranslation(true);
    setTranslationError(false);
    try {
      const [translatedQuestion, translatedExplanation, ...translatedAnswers] = await Promise.all([
        translateToTurkish(question.questionText),
        translateToTurkish(explanation),
        ...question.answers.map((answer) => translateToTurkish(answer.text))
      ]);
      setTurkish({
        question: translatedQuestion,
        explanation: translatedExplanation,
        answers: translatedAnswers
      });
    } catch {
      setTranslationError(true);
      setTurkish({
        question: question.questionText,
        explanation: question.translationTr?.explanation || `Doğru cevap: „${correctAnswer}“.`,
        answers: question.answers.map((answer) => answer.text)
      });
    } finally {
      setLoadingTranslation(false);
    }
  }

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-civic">{question.sourceNumber}</p>
          <p className="mt-1 text-sm text-slate-600">
            {question.subcategory} · PDF-Seite {question.sourcePage}
          </p>
        </div>
        <button
          type="button"
          onClick={toggleTurkish}
          className="inline-flex min-h-10 w-fit items-center gap-2 rounded-md border border-civic/25 bg-teal-50 px-3 text-sm font-bold text-civic hover:bg-teal-100"
        >
          {loadingTranslation ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Globe2 className="h-4 w-4" aria-hidden="true" />}
          {showTurkish ? "Deutsch anzeigen" : "Türkisch anzeigen"}
        </button>
      </div>

      <h2 className="text-xl font-bold leading-snug text-ink sm:text-2xl">{question.questionText}</h2>

      {showTurkish ? (
        <div className="mt-4 rounded-lg border border-civic/20 bg-teal-50 p-4 text-slate-800">
          <p className="text-xs font-bold uppercase tracking-wide text-civic">Türkçe</p>
          <p className="mt-2 font-semibold">{loadingTranslation ? "Übersetzung wird geladen ..." : turkish?.question}</p>
          {translationError ? (
            <p className="mt-2 text-sm text-amber-800">
              Automatische Übersetzung war nicht verfügbar. Die deutschen Originaltexte bleiben sichtbar.
            </p>
          ) : null}
        </div>
      ) : null}

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
              {option.id}
            </span>
            <span className="pt-0.5 text-base leading-relaxed">
              {option.text}
              {showTurkish && turkish?.answers[index] ? (
                <span className="mt-1 block text-sm font-normal text-slate-600">{turkish.answers[index]}</span>
              ) : null}
            </span>
          </button>
        ))}
      </div>

      {showFeedback && answered ? (
        <div
          className={`mt-5 flex items-start gap-3 rounded-lg border p-4 ${
            isCorrect === true
              ? "border-emerald-200 bg-emerald-50 text-emerald-950"
              : "border-red-200 bg-red-50 text-red-950"
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
            <p className="font-semibold">{isCorrect === true ? "Richtig" : "Leider falsch"}</p>
            <p className="mt-1 text-sm">Richtige Antwort: {correctAnswer}</p>
            {isCorrect === false ? <p className="mt-2 text-sm">{explanation}</p> : null}
            {showTurkish && turkish?.explanation ? (
              <p className="mt-2 rounded-md bg-white/60 p-3 text-sm text-slate-800">{turkish.explanation}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}
