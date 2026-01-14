"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuizService } from "@/services/quiz.service";

type QuestionType = "BOOLEAN" | "CHECKBOX" | "RADIO";

interface Question {
  id: string;
  title: string;
  type: QuestionType;
  options: string[];
  correctAnswers: string[];
}

export default function CreateQuizPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: generateId(),
      title: "",
      type,
      options: type === "BOOLEAN" ? ["True", "False"] : ["", ""],
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
          ? {
              ...q,
              options: q.options.filter((_, i) => i !== index),
              correctAnswers: q.correctAnswers.filter(
                (opt) => opt !== q.options[index]
              ),
            }
          : q
      )
    );
  };

  const updateOption = (id: string, index: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const newOptions = [...q.options];
          const oldValue = newOptions[index];
          newOptions[index] = value;
          const newCorrectAnswers = q.correctAnswers.map((a) =>
            a === oldValue ? value : a
          );
          return {
            ...q,
            options: newOptions,
            correctAnswers: newCorrectAnswers,
          };
        }
        return q;
      })
    );
  };

  const toggleCorrectAnswer = (qId: string, index: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;

        const stringIndex = index.toString();

        if (q.type === "CHECKBOX") {
          const isSelected = q.correctAnswers.includes(stringIndex);
          const newCorrect = isSelected
            ? q.correctAnswers.filter((a) => a !== stringIndex)
            : [...q.correctAnswers, stringIndex];
          return { ...q, correctAnswers: newCorrect };
        } else {
          // BOOLEAN або RADIO
          return { ...q, correctAnswers: [stringIndex] };
        }
      })
    );
  };

  const submitQuiz = async () => {
    if (!title.trim()) {
      alert("Quiz title is required");
      return;
    }

    // Перевірка кожного питання
    for (const [idx, q] of questions.entries()) {
      if (!q.title.trim()) {
        alert(`Question ${idx + 1} must have a title`);
        return;
      }

      if (
        (q.type === "CHECKBOX" || q.type === "RADIO") &&
        q.options.length === 0
      ) {
        alert(`Question ${idx + 1} must have at least one option`);
        return;
      }

      if (
        (q.type === "CHECKBOX" || q.type === "RADIO") &&
        (!q.correctAnswers || q.correctAnswers.length === 0)
      ) {
        alert(
          `Question ${idx + 1} must have at least one correct answer selected`
        );
        return;
      }

      if (q.type === "BOOLEAN" && q.correctAnswers?.length !== 1) {
        alert(`Question ${idx + 1} (BOOLEAN) must have a correct answer`);
        return;
      }
    }

    const payload = {
      title,
      questions: questions.map((q) => ({
        text: q.title,
        type: q.type,
        options: q.options,
        answer: q.correctAnswers.map((index) => q.options[parseInt(index)]),
      })),
    };

    try {
      const response = await QuizService.createQuiz(payload);
      console.log("Quiz created", response);
      router.push("/"); // повернення на головну після створення
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

            <div className="ml-4">
              <p className="mb-1 font-semibold">Options & Correct Answers:</p>
              {q.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2 mb-1">
                  <input
                    type="text"
                    className="border p-1 rounded w-full"
                    value={opt}
                    onChange={(e) => updateOption(q.id, i, e.target.value)}
                  />
                  <label className="flex items-center gap-1">
                    <input
                      type={q.type === "CHECKBOX" ? "checkbox" : "radio"}
                      name={`question-${q.id}`}
                      checked={q.correctAnswers.includes(i.toString())}
                      onChange={() => toggleCorrectAnswer(q.id, i)}
                    />
                    Correct
                  </label>
                  {q.type !== "BOOLEAN" && (
                    <button
                      onClick={() => removeOption(q.id, i)}
                      className="text-red-500 font-bold"
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
              {q.type !== "BOOLEAN" && (
                <button
                  onClick={() => addOption(q.id)}
                  className="mt-1 text-blue-500 font-semibold"
                >
                  + Add Option
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
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

        <button
          onClick={() => router.push("/")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back to Home
        </button>
      </div>
    </main>
  );
}
