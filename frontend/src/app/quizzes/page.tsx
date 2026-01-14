"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QuizService } from "@/services/quiz.service";

interface QuizListItem {
  id: number;
  title: string;
  questionCount: number;
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQuizzes = async () => {
    try {
      const data = await QuizService.getQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error("Failed to load quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const deleteQuiz = async (id: number) => {
    await QuizService.deleteQuiz(id);
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Quizzes</h1>

      {quizzes.length === 0 && <p className="text-gray-500">No quizzes yet</p>}

      <ul className="space-y-4">
        {quizzes.map((quiz) => (
          <li
            key={quiz.id}
            className="border p-4 flex justify-between items-center rounded"
          >
            <Link href={`/quizzes/${quiz.id}`} className="hover:underline">
              <div>
                <p className="font-semibold">{quiz.title}</p>
                <p className="text-sm text-gray-500">
                  Questions: {quiz.questionCount}
                </p>
              </div>
            </Link>

            <button
              onClick={() => deleteQuiz(quiz.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
