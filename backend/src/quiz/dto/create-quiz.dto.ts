import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

const QUESTION_TYPES = ['BOOLEAN', 'INPUT', 'CHECKBOX'] as const;

class CreateQuestionDto {
  @IsString()
  @IsIn(QUESTION_TYPES, { message: 'type must be BOOLEAN, INPUT or CHECKBOX' })
  type: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsString({ each: true })
  options?: string[]; // будем серіалізувати в рядок

  @IsOptional()
  answer?: boolean | string | string[];
}

export class CreateQuizDto {
  @IsString()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
