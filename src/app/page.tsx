"use client";

import { useMemo, useState } from "react";
import { ErrorPool } from "@/components/ErrorPool";
import { ExamMode } from "@/components/ExamMode";
import { PracticeMode } from "@/components/PracticeMode";
import { StartPage } from "@/components/StartPage";
import { StatisticsPage } from "@/components/StatisticsPage";
import {
  filterQuestions,
  getFilterOptions,
  getGradableQuestions,
  pickQuestions,
  questions
} from "@/lib/questions";
import type { Question, QuizConfig } from "@/types";

type Screen =
  | { name: "start" }
  | { name: "exam"; questions: Question[] }
  | { name: "practice"; questions: Question[] }
  | { name: "errors" }
  | { name: "statistics" };

export default function Home() {
  const [screen, setScreen] = useState<Screen>({ name: "start" });

  const filters = useMemo(() => getFilterOptions(questions), []);
  const gradableCount = useMemo(() => getGradableQuestions(questions).length, []);
  const missingCount = questions.length - gradableCount;

  function handleStart(config: QuizConfig) {
    if (config.mode === "errors") {
      setScreen({ name: "errors" });
      return;
    }
    if (config.mode === "statistics") {
      setScreen({ name: "statistics" });
      return;
    }
    const filtered = filterQuestions(questions, config.filter);
    const pool = config.mode === "exam" ? getGradableQuestions(filtered) : filtered;
    const selected = pickQuestions(pool, config.count);
    if (config.mode === "exam") {
      setScreen({ name: "exam", questions: selected });
    } else {
      setScreen({ name: "practice", questions: selected });
    }
  }

  if (screen.name === "exam") {
    return <ExamMode questions={screen.questions} onExit={() => setScreen({ name: "start" })} />;
  }

  if (screen.name === "practice") {
    return <PracticeMode questions={screen.questions} onExit={() => setScreen({ name: "start" })} />;
  }

  if (screen.name === "errors") {
    return <ErrorPool questions={questions} onExit={() => setScreen({ name: "start" })} />;
  }

  if (screen.name === "statistics") {
    return <StatisticsPage questions={questions} onExit={() => setScreen({ name: "start" })} />;
  }

  return (
    <StartPage
      totalQuestions={questions.length}
      gradableQuestions={gradableCount}
      missingQuestions={missingCount}
      filters={filters}
      onStart={handleStart}
    />
  );
}
