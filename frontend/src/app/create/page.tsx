"use client";

import { useState } from "react";
import { QuizService } from "@/services/quiz.service";

type QuestionType = "BOOLEAN" | "CHECKBOX" | "RADIO";

interface Question {
  id: string;
  title: string;
  type: QuestionType;
  options: string[];
  correctAnswers?: string[];
}

export default function CreateQuizPage() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  // Генеруємо унікальний id для кожного питання
  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: generateId(),
      title: "",
      type,
      options: type === "BOOLEAN" ? [] : ["", ""],
      correctAnswers: [],
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, key: keyof Question, value: any) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [key]: value } : q))
    );
  };

  const addOption = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, options: [...q.options, ""] } : q))
    );
  };

  const removeOption = (id: string, index: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, options: q.options.filter((_, i) => i !== index) }
          : q
      )
    );
  };

  const updateOption = (id: string, index: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const newOptions = [...q.options];
          newOptions[index] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const submitQuiz = async () => {
    const payload = {
      title,
      questions: questions.map((q) => ({
        title: q.title,
        type: q.type,
        options: q.type === "BOOLEAN" ? [] : q.options,
        correctAnswers: q.correctAnswers || [],
      })),
    };

    try {
      const response = await QuizService.createQuiz(payload);
      console.log("Quiz created", response);
    } catch (err) {
      console.error("Failed to create quiz", err);
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Quiz</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Quiz Title</label>
        <input
          type="text"
          className="border p-2 rounded w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="border p-4 rounded">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">Question {idx + 1}</p>
              <button
                onClick={() => removeQuestion(q.id)}
                className="text-red-500 font-bold"
              >
                Remove
              </button>
            </div>

            <div className="mb-2">
              <label className="block mb-1">Question Title</label>
              <input
                type="text"
                className="border p-1 rounded w-full"
                value={q.title}
                onChange={(e) => updateQuestion(q.id, "title", e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className="block mb-1">Question Type</label>
              <select
                className="border p-1 rounded"
                value={q.type}
                onChange={(e) =>
                  updateQuestion(q.id, "type", e.target.value as QuestionType)
                }
              >
                <option value="BOOLEAN">BOOLEAN</option>
                <option value="CHECKBOX">CHECKBOX</option>
                <option value="RADIO">RADIO</option>
              </select>
            </div>

            {(q.type === "CHECKBOX" || q.type === "RADIO") && (
              <div className="ml-4">
                <p className="mb-1 font-semibold">Options:</p>
                {q.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1">
                    <input
                      type="text"
                      className="border p-1 rounded w-full"
                      value={opt}
                      onChange={(e) => updateOption(q.id, i, e.target.value)}
                    />
                    <button
                      onClick={() => removeOption(q.id, i)}
                      className="text-red-500 font-bold"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addOption(q.id)}
                  className="mt-1 text-blue-500 font-semibold"
                >
                  + Add Option
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => addQuestion("BOOLEAN")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          + Add BOOLEAN Question
        </button>
        <button
          onClick={() => addQuestion("CHECKBOX")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          + Add CHECKBOX Question
        </button>
        <button
          onClick={() => addQuestion("RADIO")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          + Add RADIO Question
        </button>

        <button
          onClick={submitQuiz}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit Quiz
        </button>
      </div>
    </main>
  );
}
