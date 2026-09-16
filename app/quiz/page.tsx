"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { QuizState } from "@/lib/types";
import { getQuizState, saveQuizState } from "@/lib/storage";
import {
  Clock,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  ChevronLeft,
  Award,
  Check
} from "lucide-react";

const TOTAL_QUESTION_TIME_MS = 45000;

export default function QuizPage() {
  const router = useRouter();
  const [state, setState] = useState<QuizState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [msLeft, setMsLeft] = useState<number>(TOTAL_QUESTION_TIME_MS);
  const isAdvancingRef = useRef(false);

  useEffect(() => {
    const currentState = getQuizState();
    if (!currentState) {
      router.replace("/");
      return;
    }
    if (currentState.status === "completed") {
      router.replace("/results");
      return;
    }

    setState(currentState);

    const currentQ = currentState.questions[currentState.currentIndex];
    if (currentQ && currentState.answers[currentQ.id]) {
      setSelectedOptionId(currentState.answers[currentQ.id].selectedOptionId);
    }

    setIsLoaded(true);
  }, [router]);

  const handleAdvanceQuestion = useCallback(
    (choiceId: string | null) => {
      if (!state || isAdvancingRef.current) return;
      isAdvancingRef.current = true;

      const currentQ = state.questions[state.currentIndex];
      if (!currentQ) return;

      const isCorrect = choiceId !== null && choiceId === currentQ.correctOptionId;

      const updatedAnswers = {
        ...state.answers,
        [currentQ.id]: {
          selectedOptionId: choiceId,
          correct: isCorrect,
        },
      };

      const isLastQuestion = state.currentIndex >= state.questions.length - 1;

      if (isLastQuestion) {
        const completedState: QuizState = {
          ...state,
          answers: updatedAnswers,
          status: "completed",
          completedAt: Date.now(),
        };
        saveQuizState(completedState);
        setState(completedState);
        router.replace("/results");
      } else {
        const nextIndex = state.currentIndex + 1;
        const nextDeadline = Date.now() + TOTAL_QUESTION_TIME_MS;

        const nextState: QuizState = {
          ...state,
          answers: updatedAnswers,
          currentIndex: nextIndex,
          deadline: nextDeadline,
        };

        saveQuizState(nextState);
        setState(nextState);
        setSelectedOptionId(null);
        setMsLeft(TOTAL_QUESTION_TIME_MS);
        isAdvancingRef.current = false;
      }
    },
    [state, router]
  );

  useEffect(() => {
    if (!state || state.status !== "in-progress") return;

    const tick = () => {
      const now = Date.now();
      const remaining = state.deadline - now;

      if (remaining <= 0) {
        setMsLeft(0);
        if (!isAdvancingRef.current) {
          handleAdvanceQuestion(selectedOptionId);
        }
      } else {
        setMsLeft(remaining);
      }
    };

    tick();
    const interval = setInterval(tick, 100);
    return () => clearInterval(interval);
  }, [state, selectedOptionId, handleAdvanceQuestion]);

  useEffect(() => {
    if (!state || state.status !== "in-progress") return;
    const interval = setInterval(() => {
      saveQuizState(state);
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state) return;
      const currentQ = state.questions[state.currentIndex];
      if (!currentQ) return;

      if (e.key === "1" || e.key.toLowerCase() === "a") {
        if (currentQ.options[0]) setSelectedOptionId(currentQ.options[0].id);
      } else if (e.key === "2" || e.key.toLowerCase() === "b") {
        if (currentQ.options[1]) setSelectedOptionId(currentQ.options[1].id);
      } else if (e.key === "3" || e.key.toLowerCase() === "c") {
        if (currentQ.options[2]) setSelectedOptionId(currentQ.options[2].id);
      } else if (e.key === "4" || e.key.toLowerCase() === "d") {
        if (currentQ.options[3]) setSelectedOptionId(currentQ.options[3].id);
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleAdvanceQuestion(selectedOptionId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state, selectedOptionId, handleAdvanceQuestion]);

  if (!isLoaded || !state) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-slate-600 font-sans text-sm tracking-wide flex items-center gap-3 bg-white border border-slate-200 px-6 py-4 rounded-full shadow-lg">
          <span className="w-3.5 h-3.5 bg-blue-600 rounded-full animate-ping" />
          Loading Assessment...
        </div>
      </main>
    );
  }

  const currentQ = state.questions[state.currentIndex];
  const totalQuestions = state.questions.length;
  const isLastQuestion = state.currentIndex === totalQuestions - 1;

  const secondsLeft = Math.ceil(msLeft / 1000);
  const timerPercentage = Math.max(0, Math.min(100, (msLeft / TOTAL_QUESTION_TIME_MS) * 100));

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="min-h-screen bg-reference-mesh text-slate-900 relative overflow-hidden flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Decorative ambient items */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl" />
        <div className="deco-donut w-6 h-6 top-20 right-[15%] opacity-50 border-amber-400" />
        <div className="deco-plus top-28 left-[10%] text-blue-300 opacity-60">+</div>
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col justify-between min-h-screen w-full">
        {/* Top Header & Pips */}
        <header className="space-y-4 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-36 overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm p-1 border border-slate-100 shadow-xs">
                <Image
                  src="/logo.png"
                  alt="SJCET Bootcamp Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-slate-500 font-medium">
                Candidate: <strong className="text-slate-900 font-semibold">{state.user.name}</strong> ({state.user.className})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Track:</span>
              <span className="text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full font-bold">
                {currentQ.difficulty || "Innovation Challenge"}
              </span>
            </div>
          </div>

          {/* 10 Sequence Pips matching UI reference */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Challenge Sequence: {state.currentIndex + 1} of {totalQuestions}</span>
              <span>{Math.round(((state.currentIndex + 1) / totalQuestions) * 100)}% Complete</span>
            </div>

            <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
              {state.questions.map((q, idx) => {
                const isCurrent = idx === state.currentIndex;
                const isAnswered = Boolean(state.answers[q.id]);
                const isPast = idx < state.currentIndex;

                let pipStyle = "bg-white border-slate-200 text-slate-400";
                if (isCurrent) {
                  pipStyle = "btn-pill-primary text-white font-bold scale-105 shadow-md shadow-blue-500/25";
                } else if (isAnswered || isPast) {
                  pipStyle = "bg-blue-50 border-blue-200 text-blue-700 font-semibold";
                }

                return (
                  <div
                    key={q.id}
                    className={`h-9 rounded-xl border flex items-center justify-center text-xs transition-all ${pipStyle}`}
                    title={`Question ${idx + 1}`}
                  >
                    {idx + 1}
                  </div>
                );
              })}
            </div>
          </div>
        </header>

        {/* Main Question Card */}
        <section className="ref-card-glass p-6 sm:p-10 space-y-6 my-auto">
          {/* Timer Section */}
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
                <span>Timer for Challenge #{state.currentIndex + 1}</span>
              </div>
              <div className={`text-base font-bold font-mono px-3 py-0.5 rounded-full ${
                secondsLeft <= 10 ? "text-red-600 bg-red-50 border border-red-200 animate-pulse" : "text-blue-700 bg-blue-50"
              }`}>
                {secondsLeft.toString().padStart(2, "0")}s
              </div>
            </div>

            {/* Draining Countdown Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className={`h-full rounded-full timer-bar-fluid transition-all duration-100 ease-linear ${
                  secondsLeft <= 10
                    ? "bg-gradient-to-r from-red-500 to-amber-500"
                    : "bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-400"
                }`}
                style={{ width: `${timerPercentage}%` }}
                role="progressbar"
                aria-valuenow={secondsLeft}
                aria-valuemin={0}
                aria-valuemax={45}
              />
            </div>
          </div>

          {/* Question Readout */}
          <div className="space-y-2 py-1">
            <div className="text-xs font-extrabold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Question {state.currentIndex + 1} of {totalQuestions}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* 4 Options List */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Choose an answer (or press A / B / C / D):
            </div>

            <div className="space-y-3">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedOptionId === opt.id;
                const label = optionLabels[optIdx] || `${optIdx + 1}`;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                      isSelected
                        ? "bg-blue-50/90 border-blue-600 text-slate-900 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/20"
                        : "bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 text-slate-800"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl shrink-0 text-xs font-bold border flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {label}
                    </div>
                    <div className="text-sm sm:text-base font-medium pt-1 leading-relaxed">
                      {opt.text}
                    </div>
                    {isSelected && (
                      <div className="ml-auto mt-1 shrink-0">
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Response locks automatically when time elapses.</span>
            </div>

            <button
              type="button"
              onClick={() => handleAdvanceQuestion(selectedOptionId)}
              className="btn-pill-primary py-3 px-8 text-sm font-bold flex items-center justify-center gap-2 group sm:w-auto w-full"
            >
              {isLastQuestion ? (
                <>
                  <span>Submit Assessment</span>
                  <CheckCircle className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="mt-4 pt-3 border-t border-slate-200/80 text-xs text-slate-500 flex items-center justify-between">
          <span>IEDC BOOTCAMP SJCET</span>
          <span className="font-semibold">SHORTCUTS: [A-D, ENTER]</span>
        </footer>
      </main>
    </div>
  );
}
