"use client";

import { AlertTriangle } from "lucide-react";
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

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-6 py-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-civic">Lern-App</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight text-ink sm:text-5xl">
            Leben in Deutschland Trainer
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-700">
            Übe den Fragenkatalog für den Test „Leben in Deutschland“ und den Einbürgerungstest.
            Alle Daten werden lokal im Browser gespeichert.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-2xl font-black text-ink">{totalQuestions}</p>
              <p className="text-sm text-slate-600">Fragen im Katalog</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-2xl font-black text-mint">{gradableQuestions}</p>
              <p className="text-sm text-slate-600">mit Lösung</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-2xl font-black text-amberline">{missingQuestions}</p>
              <p className="text-sm text-slate-600">fehlende Lösung</p>
            </div>
          </div>

          {missingQuestions > 0 ? (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <p className="text-sm">
                Es gibt noch {missingQuestions} Fragen ohne hinterlegte richtige Lösung. Im Testmodus kannst du sie
                üben; sie werden als nicht bewertbar gezählt. Der Prüfungsmodus nutzt standardmäßig nur bewertbare
                Fragen.
              </p>
            </div>
          ) : null}
        </div>

        <form
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft sm:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            onStart({ mode, count, filter });
          }}
        >
          <div className="grid gap-5">
            <div>
              <label className="text-sm font-bold text-slate-800" htmlFor="mode">
                Modus
              </label>
              <div className="mt-3">
                <ModeSelector value={mode} onChange={setMode} />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800">Anzahl der Fragen</label>
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
              className="min-h-12 rounded-md bg-ink px-5 font-bold text-white transition hover:bg-slate-700"
            >
              {mode === "statistics" ? "Statistik öffnen" : mode === "errors" ? "Fehlerpool öffnen" : "Starten"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
