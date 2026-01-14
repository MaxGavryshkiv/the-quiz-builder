# the-quiz-builder

Fullstack quiz builder with Next.js frontend, Nest.js backend, and Prisma for database management.

---

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL and PORT
Database
CREATE DATABASE quizdb;
npx prisma migrate dev --name init
npm run start:dev
Backend runs at http://localhost:3030.
```

### 2. Frontend

```bash
cd frontend
npm install

npm run dev
Backend runs at http://localhost:3000.
```

### 3. Create sample quiz

1. Open the frontend in your browser:
   http://localhost:3000/create

2. Enter a **Quiz Title** in the input field.

3. Add **questions**:

- Click **+ Add Question**.
- Select the question type:
  - **BOOLEAN** – a question with Yes/No answers.
  - **CHECKBOX** – a question with multiple correct answers.
  - **RADIO** – a question with a single correct answer.
- Enter the question text.
- For CHECKBOX or RADIO, add answer options using **+ Add Option** and fill in their text.

4. Optionally, set the **correct answers** for each question:

- For BOOLEAN – leave empty or choose True/False.
- For CHECKBOX – select one or more correct options.
- For RADIO – select one correct option.

5. Click **Submit Quiz** to send it to the backend.
