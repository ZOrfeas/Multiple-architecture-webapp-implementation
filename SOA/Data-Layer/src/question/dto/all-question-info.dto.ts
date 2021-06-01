import { User } from '../../user/entities/user.entity';
import { Answer } from '../../answer/entities/answer.entity';
import { Keyword } from '../../keyword/entities/keyword.entity';
import { Question } from '../entities/question.entity';

export class AnswerWithAuthorName {
  id: number;
  ansContent: string;
  answeredOn: Date;
  displayName: string;

  constructor(answer: Answer, authorName: string) {
    this.id = answer.id;
    this.ansContent = answer.ansContent;
    this.answeredOn = answer.answeredOn;
    this.displayName = authorName;
  }
}

export class AllQuestionInfo {
  id: number;
  title: string;
  questContent: string;
  askedOn: Date;
  answers: AnswerWithAuthorName[];
  user: User;
  keywords: Keyword[];

  constructor(question: Question) {
    this.id = question.id;
    this.title = question.title;
    this.questContent = question.questContent;
    this.askedOn = question.askedOn;
    this.answers = [];
    this.user = question.user;
    this.keywords = question.keywords;
  }
}
