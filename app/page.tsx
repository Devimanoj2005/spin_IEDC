"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { QuizState, User } from "@/lib/types";
import { getQuizState, initQuizState, clearQuizState } from "@/lib/storage";
import {
  Play,
  RefreshCw,
  BarChart2,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Zap,
  Sparkles,
  Search,
  BookOpen,
  Award,
  Users,
  Compass,
  Check,
  ChevronRight,
  HelpCircle,
  X
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [existingState, setExistingState] = useState<QuizState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const formCardRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    router.prefetch("/quiz");

    const state = getQuizState();
    if (state) {
      setExistingState(state);
      if (state.user) {
        setName(state.user.name || "");
        setClassName(state.user.className || "");
      }
    }
    setIsLoaded(true);
  }, [router]);

  const handleStartNewAttempt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !className.trim()) {
      setErrorMsg("Please provide your candidate name and class/semester to continue.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/questions");
      if (!res.ok) {
        throw new Error("Failed to load question set from server.");
      }
      const data = await res.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error("Invalid question bank payload.");
      }

      const user: User = {
        name: name.trim(),
        className: className.trim(),
      };

      initQuizState(user, data.questions);
      router.push("/quiz");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred while initializing challenge.");
      setIsLoading(false);
    }
  };

  const handleResume = () => {
    router.push("/quiz");
  };

  const handleStartOver = () => {
    clearQuizState();
    setExistingState(null);
    setName("");
    setClassName("");
    setErrorMsg(null);
  };

  const handleViewResults = () => {
    router.push("/results");
  };

  const handleRetake = async () => {
    clearQuizState();
    setExistingState(null);
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (!name.trim() || !className.trim()) {
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/questions");
      if (!res.ok) throw new Error("Failed to fetch fresh questions set.");
      const data = await res.json();

      const user: User = { name: name.trim(), className: className.trim() };
      initQuizState(user, data.questions);
      router.push("/quiz");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Could not re-initialize quiz attempt.");
      setIsLoading(false);
    }
  };

  const scrollToForm = () => {
    if (formCardRef.current) {
      formCardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 300);
    }
  };

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-slate-600 font-sans text-sm tracking-wide flex items-center gap-3 bg-white border border-slate-200 px-6 py-4 rounded-full shadow-lg">
          <span className="w-3.5 h-3.5 bg-blue-600 rounded-full animate-ping" />
          Loading IEDC Quiz Engine...
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-reference-mesh text-slate-900 relative overflow-hidden flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Full-viewport background illustration matching Image 3 with low opacity */}
      <div className="fixed inset-0 w-full h-full min-h-screen pointer-events-none z-0 overflow-hidden">
        <Image
          src="/bg-hero.png"
          alt="IEDC Quiz Background Illustration"
          fill
          priority
          className="object-cover object-center opacity-20 select-none"
          sizes="100vw"
        />
        {/* Soft tint overlay ensuring maximum text contrast and legibility */}
        <div className="absolute inset-0 bg-white/40 pointer-events-none" />
      </div>

      {/* Ambient background decoration matching the reference */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Soft fluid blue clouds */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-[30rem] h-[30rem] bg-indigo-100/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl" />

        {/* Decorative elements from reference image */}
        <div className="deco-donut w-6 h-6 top-32 left-[12%] opacity-60" />
        <div className="deco-donut w-8 h-8 bottom-32 right-[8%] opacity-50 border-orange-400" />
        <div className="deco-donut w-5 h-5 top-24 right-[25%] opacity-60 border-amber-400" />
        
        <div className="deco-plus top-44 left-[32%] text-blue-400 opacity-70">+</div>
        <div className="deco-plus bottom-48 left-[8%] text-indigo-400 opacity-60 text-2xl">+</div>
        <div className="deco-plus top-28 right-[42%] text-blue-300 opacity-70">+</div>
      </div>

      {/* Modern Clean Navbar matching UI reference */}
      <header className="relative z-20 w-full pt-4 pb-2 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-44 sm:w-52 overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm p-1.5 border border-slate-100 shadow-sm flex items-center justify-center group transition-all">
              <Image
                src="/logo.png"
                alt="SJCET Bootcamp Logo"
                fill
                className="object-contain p-0.5 group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          </div>

          {/* Desktop Navigation Links matching reference */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            {/* Active Home item with distinctive warm marker */}
            <div className="relative cursor-pointer text-blue-600 font-bold flex flex-col items-center">
              <span>Home</span>
              <span className="w-6 h-1 bg-amber-400 rounded-full mt-0.5" />
            </div>

            <button
              type="button"
              onClick={() => setShowGuidelinesModal(true)}
              className="hover:text-blue-600 transition-colors"
            >
              Guidelines
            </button>

            <a
              href="#features"
              className="hover:text-blue-600 transition-colors"
            >
              Ecosystem
            </a>

            <button
              type="button"
              onClick={() => setShowGuidelinesModal(true)}
              className="hover:text-blue-600 transition-colors"
            >
              Help
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowSearchModal(true)}
              className="w-10 h-10 rounded-full hover:bg-blue-50 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-colors"
              title="Search challenges"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={scrollToForm}
              className="btn-pill-primary px-5 sm:px-6 py-2.5 text-xs sm:text-sm tracking-wide font-bold flex items-center gap-2"
            >
              <span>Great Quiz</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-14 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Hero Column: Typography & Highlights (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            
            {/* Eyebrow badge matching "CRAT A FREE" in reference */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold tracking-widest text-blue-600 uppercase">
                <span>CRAT A FREE</span>
              </div>

              {/* Bold Title: "QUIZ NOW" */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08]">
                <span className="text-blue-700">QUIZ</span>{" "}
                <span className="text-amber-500">NOW</span>
              </h1>
            </div>

            {/* Description matching reference typography */}
            <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed font-medium">
              The premier innovation assessment platform for student founders. Test your entrepreneurial quotient, startup problem solving, and product design with 10 timed interactive challenges.
            </p>

            {/* Quick Action: "Let's do it!" rounded pill button */}
            <div className="pt-1 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={scrollToForm}
                className="btn-pill-white px-8 py-3.5 text-sm sm:text-base font-bold flex items-center gap-3 group"
              >
                <span>Let&apos;s do it!</span>
                <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white/90 backdrop-blur-md border border-slate-200/80 px-4 py-2 rounded-full shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>10 Challenges • 45s Clock</span>
              </div>
            </div>

            {/* Interactive achievement badges */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-700">
              <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs rounded-full px-4 py-2 flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-black text-xs">
                  ★
                </div>
                <span>KSUM Ecosystem Standard</span>
              </div>

              <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs rounded-full px-4 py-2 flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs">
                  ⚡
                </div>
                <span>Live Assessment Engine</span>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Candidate Terminal (5 cols) */}
          <div className="lg:col-span-5">
            <div
              ref={formCardRef}
              className="ref-card-glass p-6 sm:p-8 space-y-5 relative overflow-hidden transition-all duration-300 shadow-xl"
            >
              {/* Card top bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Candidate Portal
                </div>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-0.5 rounded-full">
                  SJCET CHAPTER
                </span>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-2xl flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <div className="font-medium">{errorMsg}</div>
                </div>
              )}

              {/* STATE 1: ACTIVE IN-PROGRESS ATTEMPT */}
              {existingState && existingState.status === "in-progress" ? (
                <div className="space-y-4">
                  <div className="bg-blue-50/80 border border-blue-100 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider">
                      <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping" />
                      Active Assessment In Progress
                    </div>
                    <div>
                      <div className="text-slate-900 font-bold text-base">{existingState.user.name}</div>
                      <div className="text-slate-600 text-xs">{existingState.user.className}</div>
                      <div className="text-xs font-bold text-blue-700 pt-1">
                        Currently at Question #{existingState.currentIndex + 1} of 10
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleResume}
                      className="btn-pill-primary py-3.5 px-6 text-sm font-bold flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Resume Quiz
                    </button>

                    <button
                      type="button"
                      onClick={handleStartOver}
                      className="btn-pill-white py-3 px-4 text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Start Over
                    </button>
                  </div>
                </div>
              ) : existingState && existingState.status === "completed" ? (
                /* STATE 2: COMPLETED QUIZ */
                <div className="space-y-4">
                  <div className="bg-emerald-50/80 border border-emerald-100 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Assessment Completed
                    </div>
                    <div>
                      <div className="text-slate-900 font-bold text-base">{existingState.user.name}</div>
                      <div className="text-slate-600 text-xs">{existingState.user.className}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleViewResults}
                      className="btn-pill-primary py-3.5 px-6 text-sm font-bold flex items-center justify-center gap-2"
                    >
                      <BarChart2 className="w-4 h-4" />
                      View Scorecard
                    </button>

                    <button
                      type="button"
                      onClick={handleRetake}
                      disabled={isLoading}
                      className="btn-pill-white py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                      {isLoading ? "Preparing..." : "Retake Quiz"}
                    </button>
                  </div>
                </div>
              ) : (
                /* STATE 3: BLANK CANDIDATE FORM */
                <form onSubmit={handleStartNewAttempt} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="candidate-name" className="block text-xs font-bold uppercase text-slate-700 tracking-wider">
                      Candidate Full Name <span className="text-blue-600">*</span>
                    </label>
                    <input
                      id="candidate-name"
                      ref={nameInputRef}
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Arjun Varma"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="candidate-class" className="block text-xs font-bold uppercase text-slate-700 tracking-wider">
                      Class / Semester / Branch <span className="text-blue-600">*</span>
                    </label>
                    <input
                      id="candidate-class"
                      type="text"
                      required
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      placeholder="e.g. S6 CSE - Batch B"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-pill-primary py-3.5 text-sm font-bold flex items-center justify-center gap-2 group disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating Questions...
                      </>
                    ) : (
                      <>
                        <span>Start Assessment</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </main>

      {/* Feature Highlights Grid */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="ref-card p-6 space-y-3 hover:border-blue-300 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">45s Dynamic Timer</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Every challenge features an adaptive 45-second countdown to assess agility, prompt decision-making, and startup reflexes.
            </p>
          </div>

          <div className="ref-card p-6 space-y-3 hover:border-amber-300 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Randomized Bank</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Dynamic server-side Fisher-Yates shuffle presents 10 unique, shuffled questions from an extensive entrepreneurship repository.
            </p>
          </div>

          <div className="ref-card p-6 space-y-3 hover:border-indigo-300 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <BarChart2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Instant Performance Readout</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Comprehensive analytics, percentage breakdown, and question-by-question review immediately upon submission.
            </p>
          </div>
        </div>
      </section>

      {/* Clean Minimalist Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 bg-white/80 backdrop-blur-md py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-blue-700">IEDC BOOTCAMP</span>
            <span>•</span>
            <span>St. Joseph&apos;s College of Engineering and Technology (SJCET)</span>
          </div>

          <div className="flex items-center gap-6 font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setShowGuidelinesModal(true)}
              className="hover:text-blue-600 transition-colors"
            >
              Evaluation Criteria
            </button>
            <span className="text-amber-500 font-bold">#IgniteBuildLaunch</span>
          </div>
        </div>
      </footer>

      {/* Guidelines Modal */}
      {showGuidelinesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="ref-card-glass max-w-lg w-full p-6 sm:p-8 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 font-bold text-base text-slate-900">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Challenge Guidelines & Rules
              </div>
              <button
                type="button"
                onClick={() => setShowGuidelinesModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <strong className="text-slate-900">10 Timed Questions:</strong> Each assessment consists of 10 curated questions spanning business modeling, prototyping, and startup strategy.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <strong className="text-slate-900">45-Second Countdown:</strong> You have 45 seconds per challenge. Unanswered questions lock and advance automatically when time expires.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <strong className="text-slate-900">Keyboard Shortcuts:</strong> Use keys <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs font-mono font-bold text-slate-700">A</kbd>, <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs font-mono font-bold text-slate-700">B</kbd>, <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs font-mono font-bold text-slate-700">C</kbd>, <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs font-mono font-bold text-slate-700">D</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs font-mono font-bold text-slate-700">1-4</kbd> and <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs font-mono font-bold text-slate-700">Enter</kbd> to answer swiftly.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGuidelinesModal(false)}
              className="w-full btn-pill-primary py-3 text-sm font-bold"
            >
              Got it, Let&apos;s Play
            </button>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="ref-card-glass max-w-md w-full p-6 space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Search className="w-4 h-4 text-blue-600" />
                Find Challenge Track
              </div>
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entrepreneurship topics..."
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-medium"
            />

            <div className="text-xs text-slate-500 space-y-2">
              <div className="font-semibold text-slate-700">Popular Topics:</div>
              <div className="flex flex-wrap gap-2">
                {["Design Thinking", "Lean Canvas", "MVP Development", "Venture Capital", "Patents & IP"].map((topic) => (
                  <span
                    key={topic}
                    onClick={() => {
                      setSearchQuery(topic);
                      setShowSearchModal(false);
                      scrollToForm();
                    }}
                    className="cursor-pointer bg-slate-100 hover:bg-blue-50 hover:text-blue-600 px-3 py-1 rounded-full transition-colors"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
