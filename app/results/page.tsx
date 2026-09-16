"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { QuizState } from "@/lib/types";
import { getQuizState, clearQuizState, initQuizState } from "@/lib/storage";
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  Home,
  Award,
  BarChart3,
  Sparkles,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Share2
} from "lucide-react";

export default function ResultsPage() {
  const router = useRouter();
  const [state, setState] = useState<QuizState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const currentState = getQuizState();
    if (!currentState || currentState.status !== "completed") {
      router.replace("/");
      return;
    }
    setState(currentState);
    setIsLoaded(true);
  }, [router]);

  const handleRetake = async () => {
    if (!state) return;
    setIsLoading(true);

    try {
      const userCopy = { ...state.user };
      clearQuizState();

      const res = await fetch("/api/questions");
      if (!res.ok) throw new Error("Failed to fetch fresh questions set.");
      const data = await res.json();

      initQuizState(userCopy, data.questions);
      router.push("/quiz");
    } catch (error) {
      console.error("Retake error:", error);
      setIsLoading(false);
    }
  };

  const handleReturnHome = () => {
    router.push("/");
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (!isLoaded || !state) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-slate-600 font-sans text-sm tracking-wide flex items-center gap-3 bg-white border border-slate-200 px-6 py-4 rounded-full shadow-lg">
          <span className="w-3.5 h-3.5 bg-blue-600 rounded-full animate-ping" />
          Preparing Scorecard Summary...
        </div>
      </main>
    );
  }

  const totalQuestions = state.questions.length;
  let correctCount = 0;
  state.questions.forEach((q) => {
    if (state.answers[q.id]?.correct) {
      correctCount += 1;
    }
  });

  const percentage = Math.round((correctCount / totalQuestions) * 100);

  let statusBadge = "Ecosystem Contender";
  let statusColor = "text-slate-700 border-slate-200 bg-slate-50";
  if (percentage >= 80) {
    statusBadge = "High-Traction Innovator";
    statusColor = "text-blue-700 border-blue-200 bg-blue-50 font-bold";
  } else if (percentage >= 50) {
    statusBadge = "Promising Prototype";
    statusColor = "text-amber-700 border-amber-200 bg-amber-50 font-bold";
  }

  return (
    <div className="min-h-screen bg-reference-mesh text-slate-900 relative overflow-hidden flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Ambient background decoration */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl" />
        <div className="deco-donut w-6 h-6 top-16 right-[18%] opacity-50 border-amber-400" />
        <div className="deco-plus bottom-32 left-[12%] text-blue-300 opacity-60">+</div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full my-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 text-xs">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-40 overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm p-1 border border-slate-100 shadow-xs">
              <Image
                src="/logo.png"
                alt="SJCET Bootcamp Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full font-bold">
              OFFICIAL READOUT // SJCET IEDC
            </span>
          </div>

          <div className="text-slate-500 font-medium">
            Completed:{" "}
            <span className="text-slate-800 font-semibold">
              {state.completedAt
                ? new Date(state.completedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "Just now"}
            </span>
          </div>
        </header>

        {/* Hero Score Panel */}
        <section className="ref-card-glass p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Score Display (5 cols) */}
          <div className="md:col-span-5 text-center md:text-left border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-8 space-y-4">
            <div className="text-xs text-blue-600 uppercase tracking-wider flex items-center justify-center md:justify-start gap-1.5 font-bold">
              <Award className="w-4 h-4 text-amber-500" />
              Final Scorecard
            </div>

            <div className="text-6xl sm:text-7xl font-black text-slate-900 flex items-baseline justify-center md:justify-start gap-2">
              <span className="text-blue-700">{correctCount}</span>
              <span className="text-slate-400 text-3xl font-normal">/ {totalQuestions}</span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
              <span className="text-2xl font-black text-amber-500">{percentage}%</span>
              <span className={`text-xs px-3.5 py-1 rounded-full border uppercase tracking-wider ${statusColor}`}>
                {statusBadge}
              </span>
            </div>
          </div>

          {/* Candidate Profile & Quick Stats (7 cols) */}
          <div className="md:col-span-7 space-y-5">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Candidate Profile</div>
              <div className="text-xl font-bold text-slate-900">{state.user.name}</div>
              <div className="text-xs text-slate-500 font-medium">{state.user.className}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 bg-blue-50/80 border border-blue-100 rounded-2xl space-y-1">
                <div className="text-slate-500 font-medium">Correct Answers</div>
                <div className="text-xl font-black text-blue-700">{correctCount} <span className="text-xs font-normal">/ 10</span></div>
              </div>

              <div className="p-4 bg-amber-50/80 border border-amber-100 rounded-2xl space-y-1">
                <div className="text-slate-500 font-medium">Incorrect / Expired</div>
                <div className="text-xl font-black text-amber-600">{totalQuestions - correctCount} <span className="text-xs font-normal">/ 10</span></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={handleRetake}
                disabled={isLoading}
                className="btn-pill-primary py-3 px-6 text-sm font-bold flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                <span>{isLoading ? "Preparing..." : "Retake Assessment"}</span>
              </button>

              <button
                type="button"
                onClick={handleReturnHome}
                className="btn-pill-white py-3 px-5 text-sm font-bold flex items-center gap-2"
              >
                <Home className="w-4 h-4 text-slate-500" />
                <span>Home</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="btn-pill-white py-3 px-4 text-xs font-bold flex items-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                <span>{copiedLink ? "Link Copied!" : "Share"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Detailed Review Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Detailed Challenge Review
            </h3>
            <span className="text-xs text-slate-500 font-medium">10 Questions Readout</span>
          </div>

          <div className="space-y-3">
            {state.questions.map((q, idx) => {
              const answer = state.answers[q.id];
              const isCorrect = answer?.correct;
              const selectedOpt = q.options.find((o) => o.id === answer?.selectedOptionId);
              const correctOpt = q.options.find((o) => o.id === q.correctOptionId);

              return (
                <div
                  key={q.id}
                  className={`ref-card p-5 space-y-3 transition-all ${
                    isCorrect ? "border-emerald-100 bg-white" : "border-slate-100 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                        Challenge #{idx + 1}
                      </div>
                      <div className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {q.question}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Correct
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                          <XCircle className="w-3.5 h-3.5" />
                          {answer?.selectedOptionId ? "Incorrect" : "Time Expired"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                      <div className="text-slate-400 font-medium">Your Selection:</div>
                      <div className="text-slate-800 font-semibold">
                        {selectedOpt ? (
                          selectedOpt.text
                        ) : (
                          <span className="text-rose-600 italic">No answer selected (Timed out)</span>
                        )}
                      </div>
                    </div>

                    <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-1">
                      <div className="text-blue-600 font-medium">Correct Option:</div>
                      <div className="text-blue-950 font-semibold">
                        {correctOpt ? correctOpt.text : "N/A"}
                      </div>
                    </div>
                  </div>

                  {q.explanation && (
                    <div className="text-xs text-slate-600 bg-amber-50/60 border border-amber-100/70 p-3.5 rounded-2xl leading-relaxed">
                      <strong className="text-amber-800">Insight: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>Innovation & Entrepreneurship Development Cell (IEDC) • SJCET Chapter</div>
          <button
            type="button"
            onClick={handleRetake}
            disabled={isLoading}
            className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Retake With New Questions →</span>
          </button>
        </footer>
      </main>
    </div>
  );
}

