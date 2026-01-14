"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QuizService } from "@/services/quiz.service";

interface Quiz {
  id: number;
  title: string;
  _count: { questions: number };
  createdAt: string;
}

export default function QuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = async () => {
    try {
      const data = await QuizService.getQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
      alert("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this quiz?");
    if (!confirmed) return;

    try {
      await QuizService.deleteQuiz(id);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
      alert("Quiz deleted successfully");
    } catch (err) {
      console.error("Failed to delete quiz", err);
      alert("Failed to delete quiz");
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        All Quizzes
      </h1>

      <button
        onClick={() => router.push("/")}
        className="mb-6 bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-600 dark:hover:bg-gray-700"
      >
        Back to Home
      </button>

      <div className="grid gap-4">
        {quizzes.length === 0 && (
          <p className="text-gray-700 dark:text-gray-300">
            No quizzes found. Create one first!
          </p>
        )}

        {quizzes.map((q) => (
          <div
            key={q.id}
            className="border rounded-lg p-4 shadow-sm transition-shadow
                       bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100
                       hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2">{q.title}</h2>
            <p className="text-sm mb-1">
              Questions:{" "}
              <span className="font-medium">{q._count.questions}</span>
            </p>

            <div className="flex gap-2 flex-wrap mt-2">
              <button
                onClick={() => router.push(`/quizzes/${q.id}`)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                View
              </button>

              <button
                onClick={() => handleDelete(q.id)}
                className="bg-red-500 dark:bg-red-600 text-white px-3 py-1 rounded hover:bg-red-600 dark:hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
