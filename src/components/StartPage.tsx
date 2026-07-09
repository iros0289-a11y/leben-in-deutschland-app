"use client";

import { BookOpenCheck, ClipboardCheck, GraduationCap } from "lucide-react";
import { useState } from "react";
import { ALL_FILTER } from "@/lib/questions";
import type { QuestionCount, QuizConfig, QuizMode } from "@/types";
import { ModeSelector } from "./ModeSelector";

type StartPageProps = {
  totalQuestions: number;
  gradableQuestions: number;
  missingQuestions: number;
  filters: string[];
  onStart: (config: QuizConfig) => void;
};

const counts: QuestionCount[] = [10, 20, 30, 50, "all"];

export function StartPage({
  totalQuestions,
  gradableQuestions,
  missingQuestions,
  filters,
  onStart
}: StartPageProps) {
  const [count, setCount] = useState<QuestionCount>(30);
  const [mode, setMode] = useState<QuizMode>("practice");
  const [filter, setFilter] = useState(ALL_FILTER);

  function startWith(selectedMode: QuizMode) {
    setMode(selectedMode);
    onStart({ mode: selectedMode, count, filter });
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <section className="py-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-md bg-teal-50 px-3 py-2 text-sm font-bold text-civic">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              BAMF Lernplattform
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-ink sm:text-5xl">
              Test „Leben in Deutschland“ üben
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-700">
              Trainiere alle offiziellen Fragen nacheinander, wiederhole Fehler gezielt und simuliere die Prüfung
              unter Zeitdruck. Die Fragen rotieren zufällig, damit du den ganzen Katalog lernst.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
            <button
              type="button"
              onClick={() => startWith("practice")}
              className="flex min-h-24 items-center gap-3 rounded-lg bg-civic p-4 text-left font-bold text-white shadow-soft hover:bg-[#006a70]"
            >
              <BookOpenCheck className="h-7 w-7 shrink-0" aria-hidden="true" />
              <span>
                <span className="block text-lg">Test starten</span>
                <span className="block text-sm font-normal text-white/85">Direkt sehen, ob es stimmt</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => startWith("exam")}
              className="flex min-h-24 items-center gap-3 rounded-lg bg-ink p-4 text-left font-bold text-white shadow-soft hover:bg-[#123442]"
            >
              <ClipboardCheck className="h-7 w-7 shrink-0" aria-hidden="true" />
              <span>
                <span className="block text-lg">Prüfung starten</span>
                <span className="block text-sm font-normal text-white/85">Ergebnis erst am Ende</span>
              </span>
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Metric label="Fragen im Katalog" value={totalQuestions} tone="text-ink" />
          <Metric label="mit offizieller Antwort" value={gradableQuestions} tone="text-mint" />
          <Metric label="fehlende Lösungen" value={missingQuestions} tone="text-amberline" />
        </div>
      </section>

      <section className="grid gap-6 pb-8 lg:grid-cols-[0.95fr_1.05fr]">
        <form
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft sm:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            onStart({ mode, count, filter });
          }}
        >
          <div className="grid gap-5">
            <div>
              <p className="text-sm font-bold text-slate-800">Was möchtest du machen?</p>
              <div className="mt-3">
                <ModeSelector value={mode} onChange={setMode} />
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">Anzahl der Fragen</p>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {counts.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCount(item)}
                    className={`min-h-11 rounded-md border px-2 text-sm font-bold transition ${
                      count === item
                        ? "border-mint bg-emerald-50 text-mint"
                        : "border-slate-200 bg-white text-slate-700 hover:border-mint/50"
                    }`}
                  >
                    {item === "all" ? "Alle" : item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800" htmlFor="filter">
                Bereich
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="mt-3 min-h-12 w-full rounded-md border border-slate-200 bg-white px-3 text-slate-800"
              >
                <option value={ALL_FILTER}>Alle Bereiche</option>
                {filters.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="min-h-12 rounded-md bg-civic px-5 font-bold text-white transition hover:bg-[#006a70]"
            >
              {mode === "statistics" ? "Statistik öffnen" : mode === "errors" ? "Fehlerpool öffnen" : "Auswahl starten"}
            </button>
          </div>
        </form>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <h2 className="text-2xl font-black text-ink">So lernst du effizient</h2>
          <div className="mt-5 grid gap-4">
            <InfoStep title="1. Testmodus" text="Du beantwortest Frage für Frage und bekommst sofort Rückmeldung mit richtiger Antwort." />
            <InfoStep title="2. Prüfungsmodus" text="Du arbeitest unter Zeitdruck. Richtig oder falsch siehst du erst in der Auswertung." />
            <InfoStep title="3. Fehlerpool" text="Falsch beantwortete Fragen werden gesammelt und verschwinden nach zwei richtigen Wiederholungen." />
            <InfoStep title="4. Türkisch-Hilfe" text="Bei jeder Frage kannst du Frage, Antworten und Begründung auf Türkisch anzeigen lassen." />
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <p className={`text-3xl font-black ${tone}`}>{value}</p>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </div>
  );
}

function InfoStep({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="font-black text-civic">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-700">{text}</p>
    </div>
  );
}
