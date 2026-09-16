import { QuizState, User, Question } from "./types";

const STORAGE_KEY = "iedc_quiz_state";

/**
 * Reads the current QuizState from localStorage. Returns null if none exists or invalid JSON.
 */
export function getQuizState(): QuizState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as QuizState;
  } catch (error) {
    console.error("Failed to parse quiz state from localStorage:", error);
    return null;
  }
}

/**
 * Saves QuizState object to localStorage.
 */
export function saveQuizState(state: QuizState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save quiz state to localStorage:", error);
  }
}

/**
 * Clears quiz state from localStorage.
 */
export function clearQuizState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear quiz state from localStorage:", error);
  }
}

/**
 * Initializes a fresh quiz attempt with user info and 10 questions.
 */
export function initQuizState(user: User, questions: Question[]): QuizState {
  const now = Date.now();
  const newState: QuizState = {
    user,
    questions,
    answers: {},
    currentIndex: 0,
    deadline: now + 45000, // 45 seconds timer deadline for question 0
    status: "in-progress",
    startedAt: now,
  };
  saveQuizState(newState);
  return newState;
}
