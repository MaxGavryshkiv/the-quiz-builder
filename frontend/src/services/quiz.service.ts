export class QuizService {
  static async createQuiz(data: any) {
    const res = await fetch("http://localhost:3030/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create quiz");
    return res.json();
  }

  static async getQuizzes() {
    const res = await fetch("http://localhost:3030/quizzes");
    if (!res.ok) throw new Error("Failed to fetch quizzes");
    return res.json();
  }

  static async getQuizById(id: number) {
    const res = await fetch(`http://localhost:3030/quizzes/${id}`);
    if (!res.ok) throw new Error("Failed to fetch quiz");
    return res.json();
  }

  static async deleteQuiz(id: number) {
    const res = await fetch(`http://localhost:3030/quizzes/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete quiz");
    return res.json();
  }
}
