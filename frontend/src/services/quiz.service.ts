import { Quiz } from "@/types/quiz";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const QuizService = {
  async createQuiz(data: Quiz) {
    const res = await fetch(`${API_URL}/quizzes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create quiz");
    return res.json();
  },

  async getQuizzes() {
    const res = await fetch(`${API_URL}/quizzes`);
    return res.json();
  },

  async getQuiz(id: string) {
    const res = await fetch(`${API_URL}/quizzes/${id}`);
    return res.json();
  },

  async deleteQuiz(id: number) {
    await fetch(`${API_URL}/quizzes/${id}`, { method: "DELETE" });
  },
};
