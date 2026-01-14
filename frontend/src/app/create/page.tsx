"use client";

import { useState } from "react";
import { QuizService } from "@/services/quiz.service";
import { Question } from "@/types/quiz";

export default function CreateQuizPage() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    setQuestions([...questions, { type: "INPUT", text: "" }]);
  };

  const updateQuestion = (i: number, field: string, value: any) => {
    const copy = [...questions];
    (copy[i] as any)[field] = value;
    setQuestions(copy);
  };

  const submit = async () => {
    await QuizService.createQuiz({ title, questions });
    alert("Quiz created");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>

      <input
        className="border p-2 w-full mb-4"
        placeholder="Quiz title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {questions.map((q, i) => (
        <div key={i} className="border p-4 mb-3">
          <select
            className="border p-1 mb-2"
            value={q.type}
            onChange={(e) => updateQuestion(i, "type", e.target.value)}
          >
            <option value="INPUT">Input</option>
            <option value="BOOLEAN">Boolean</option>
            <option value="CHECKBOX">Checkbox</option>
          </select>

          <input
            className="border p-2 w-full"
            placeholder="Question text"
            value={q.text}
            onChange={(e) => updateQuestion(i, "text", e.target.value)}
          />
        </div>
      ))}

      <button onClick={addQuestion} className="bg-gray-200 px-4 py-2 mr-2">
        Add question
      </button>

      <button onClick={submit} className="bg-black text-white px-4 py-2">
        Save quiz
      </button>
    </div>
  );
}
