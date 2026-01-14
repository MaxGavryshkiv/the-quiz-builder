export type QuestionType = "BOOLEAN" | "INPUT" | "CHECKBOX";

export interface Question {
  type: QuestionType;
  text: string;
  options?: string[];
  answer?: boolean | string | string[];
}

export interface Quiz {
  id?: number;
  title: string;
  questions: Question[];
}
