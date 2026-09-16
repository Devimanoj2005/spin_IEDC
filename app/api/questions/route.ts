import { NextResponse } from "next/server";
import { Question } from "@/lib/types";
import { getRandomSubarray, shuffleArray } from "@/lib/shuffle";
import questionsData from "@/data/questions.json";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allQuestions = questionsData as Question[];

    // Pick 10 random questions from the 30-question bank (0ms memory operation)
    const selectedQuestions = getRandomSubarray(allQuestions, 10);

    // Shuffle options for each selected question
    const processedQuestions: Question[] = selectedQuestions.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));

    return NextResponse.json({ questions: processedQuestions });
  } catch (error) {
    console.error("Error loading question bank:", error);
    return NextResponse.json(
      { error: "Failed to load question bank" },
      { status: 500 }
    );
  }
}
