import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateQuizDto) {
    return this.prisma.quiz.create({
      data: {
        title: dto.title,
        questions: {
          create: dto.questions.map((q) => ({
            type: q.type,
            text: q.text,
            options: q.options ? JSON.stringify(q.options) : null,
            answer:
              q.answer !== undefined
                ? typeof q.answer === 'string'
                  ? q.answer
                  : JSON.stringify(q.answer)
                : null,
          })),
        },
      },
      include: { questions: true },
    });
  }

  async findAll() {
    return this.prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: { questions: true },
    });
    if (!quiz) throw new NotFoundException('Quiz not found');

    const questions = quiz.questions.map((q) => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : undefined,
      answer:
        q.answer &&
        (q.type === 'CHECKBOX' ||
          (typeof q.answer === 'string' && q.answer.startsWith('[')))
          ? JSON.parse(q.answer)
          : q.answer === 'true'
            ? true
            : q.answer === 'false'
              ? false
              : q.answer,
    }));

    return { ...quiz, questions };
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.quiz.delete({ where: { id } });
  }
}
