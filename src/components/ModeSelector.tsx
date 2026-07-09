"use client";

import { BarChart3, ClipboardCheck, ListChecks, RotateCcw } from "lucide-react";
import type { ComponentType } from "react";
import type { QuizMode } from "@/types";

type ModeSelectorProps = {
  value: QuizMode;
  onChange: (mode: QuizMode) => void;
};

const modes: Array<{
  id: QuizMode;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  {
    id: "exam",
    label: "Prüfungsmodus",
    description: "Nur bewertbare Fragen, mit Timer.",
    icon: ClipboardCheck
  },
  {
    id: "practice",
    label: "Testmodus",
    description: "Alle Fragen mit direktem Feedback.",
    icon: ListChecks
  },
  {
    id: "errors",
    label: "Fehlerpool",
    description: "Falsch beantwortete Fragen wiederholen.",
    icon: RotateCcw
  },
  {
    id: "statistics",
    label: "Statistik",
    description: "Fortschritt und häufige Fehler ansehen.",
    icon: BarChart3
  }
];

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className="grid gap-3">
      {modes.map((item) => {
        const Icon = item.icon;
        const active = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`flex min-h-16 items-center gap-3 rounded-lg border p-3 text-left transition ${
              active
                ? "border-civic bg-blue-50 text-civic"
                : "border-slate-200 bg-white text-slate-700 hover:border-civic/40"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>
              <span className="block font-bold">{item.label}</span>
              <span className="block text-sm text-slate-600">{item.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
