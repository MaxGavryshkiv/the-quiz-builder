import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Quiz Builder</h1>

      <div className="flex flex-col gap-4">
        <Link href="/create" className="border p-4 hover:bg-gray-100 rounded">
          ➕ Create Quiz
        </Link>

        <Link href="/quizzes" className="border p-4 hover:bg-gray-100 rounded">
          📋 View Quizzes
        </Link>
      </div>
    </main>
  );
}
