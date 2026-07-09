"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { recordAnswer } from "@/lib/storage";
import type { AnswerResult, Question } from "@/types";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";
import { ResultPage } from "./ResultPage";

type PracticeModeProps = {
  questions: Question[];
  title?: string;
  onExit: () => void;
};

export function PracticeMode({ questions, title = "Testmodus", onExit }: PracticeModeProps) {
  const [index, setIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [finished, setFinished] = useState(false);

  const current = questions[index];
  const answered = Boolean(selectedAnswerId);

  const progress = useMemo(() => {
    if (!questions.length) {
      return 0;
    }
    return Math.round(((index + (answered ? 1 : 0)) / questions.length) * 100);
  }, [answered, index, questions.length]);

  if (!questions.length) {
    return <EmptyState title={title} onExit={onExit} />;
  }

  if (finished) {
    return (
      <ResultPage
        title={title}
        questions={questions}
        results={results}
        onBack={onExit}
        onRepeat={() => {
          setIndex(0);
          setSelectedAnswerId(null);
          setResults([]);
          setFinished(false);
        }}
      />
    );
  }

  function handleSelect(answerId: string) {
    if (!current || answered) {
      return;
    }
    const result: AnswerResult = {
      questionId: current.id,
      selectedAnswerId: answerId,
      correctAnswerId: current.correctAnswerId,
      isCorrect: current.correctAnswerId ? answerId === current.correctAnswerId : null
    };
    setSelectedAnswerId(answerId);
    setResults((items) => [...items, result]);
    recordAnswer(current, result);
  }

  function handleNext() {
    if (index >= questions.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setSelectedAnswerId(null);
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
          Zurück
        </button>
        <p className="text-sm font-semibold text-slate-600">
          Frage {index + 1} von {questions.length}
        </p>
      </div>

      <div className="mb-5">
        <ProgressBar value={progress} label={`Fortschritt ${progress}%`} />
      </div>

      <QuestionCard
        question={current}
        selectedAnswerId={selectedAnswerId}
        showFeedback={answered}
        locked={answered}
        onSelect={handleSelect}
      />

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          disabled={!answered}
          onClick={handleNext}
          className="inline-flex min-h-12 items-center gap-2 rounded-md bg-ink px-5 font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {index >= questions.length - 1 ? "Auswertung anzeigen" : "Nächste Frage"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </main>
  );
}

function EmptyState({ title, onExit }: { title: string; onExit: () => void }) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-civic">{title}</p>
        <h1 className="mt-2 text-2xl font-black text-ink">Keine Fragen gefunden</h1>
        <p className="mt-3 text-slate-600">Passe den Bereichsfilter an oder starte mit allen Bereichen.</p>
        <button
          type="button"
          onClick={onExit}
          className="mt-5 rounded-md bg-ink px-5 py-3 font-bold text-white hover:bg-slate-700"
        >
          Zur Startseite
        </button>
      </section>
    </main>
  );
}
