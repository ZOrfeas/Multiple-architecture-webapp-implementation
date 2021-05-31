import { Question } from '../entities/question.entity';

export class QuestionWithAnsCount {
  question: Question;
  ansCount: number;

  constructor(question: Question, ansCount: number) {
    this.question = question;
    this.ansCount = ansCount;
  }
}
