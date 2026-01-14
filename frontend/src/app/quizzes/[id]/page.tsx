"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuizService } from "@/services/quiz.service";

type QuestionType = "BOOLEAN" | "CHECKBOX" | "RADIO";

interface Question {
  title: string;
  type: QuestionType;
  options: string[];
  answer: string[];
}

interface Quiz {
  id: number;
  title: string;
  questions: Question[];
  createdAt: string;
}

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchQuiz = async () => {
      try {
        const data = await QuizService.getQuizById(parseInt(id));
        // нормалізація даних
        const normalized: Quiz = {
          ...data,
          questions: data.questions.map((q: any) => ({
            ...q,
            options: q.options || [],
            answer:
              q.answer && q.answer.length
                ? Array.isArray(q.answer)
                  ? q.answer.map(String)
                  : [String(q.answer)]
                : [],
          })),
        };
        setQuiz(normalized);
      } catch (err) {
        console.error(err);
        alert("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!quiz) return <p className="p-6">Quiz not found</p>;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      <p className="mb-4 text-sm text-gray-500">
        Created at: {new Date(quiz.createdAt).toLocaleString()} | Questions:{" "}
        {quiz.questions.length}
      </p>

      <div className="space-y-4">
        {quiz.questions.map((q, idx) => (
          <div key={idx} className="border p-4 rounded hover:shadow-md">
            <p className="font-semibold mb-2">
              {idx + 1}. {q.title} ({q.type})
            </p>
            <ul className="list-disc ml-6">
              {q.options.map((opt, i) => {
                const isCorrect = q.answer.includes(opt);
                return (
                  <li
                    key={i}
                    className={isCorrect ? "font-semibold text-green-600" : ""}
                  >
                    {opt}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/")}
        className="mt-6 bg-gray-500 text-white px-4 py-2 rounded"
      >
        Back to Home
      </button>
    </main>
  );
}
