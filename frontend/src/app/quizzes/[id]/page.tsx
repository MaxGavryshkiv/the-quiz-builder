"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuizService } from "@/services/quiz.service";

interface Question {
  id: number;
  type: "BOOLEAN" | "INPUT" | "CHECKBOX";
  title: string;
  options?: string[];
}

interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

export default function QuizDetailPage() {
  const params = useParams();
  const quizId = params.id;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quizId) return;
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      const data = await QuizService.getQuizById(Number(quizId));
      setQuiz(data);
    } catch (error) {
      console.error("Failed to load quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading quiz...</p>;
  if (!quiz) return <p className="p-6">Quiz not found</p>;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{quiz.title}</h1>

      {quiz.questions.length === 0 && (
        <p className="text-gray-500">No questions yet</p>
      )}

      <ul className="space-y-4">
        {quiz.questions.map((q) => (
          <li key={q.id} className="border p-4 rounded">
            <p className="font-semibold">{q.title}</p>
            <p className="text-sm text-gray-500 mb-2">{q.type}</p>

            {q.type === "BOOLEAN" && (
              <div className="flex gap-4">
                <span>True</span>
                <span>False</span>
              </div>
            )}

            {q.type === "INPUT" && (
              <input
                type="text"
                placeholder="Short answer"
                className="border p-1 rounded w-full"
                disabled
              />
            )}

            {q.type === "CHECKBOX" && (
              <ul className="ml-4 list-disc">
                {q.options?.map((opt, idx) => (
                  <li key={idx}>
                    <input type="checkbox" disabled /> {opt}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
