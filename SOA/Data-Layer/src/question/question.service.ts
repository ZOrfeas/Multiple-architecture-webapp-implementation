import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { User } from '../user/entities/user.entity';
import { Keyword } from '../keyword/entities/keyword.entity';
import { Answer } from '../answer/entities/answer.entity';
import { QuestionWithAnsCount } from './dto/question-with-ansCount.dto';
import { AllQuestionInfo, AnswerWithAuthorName } from './dto/all-question-info.dto';

@Injectable()
export class QuestionService {
  private readonly logger = new Logger(QuestionService.name);

  constructor(
    @InjectRepository(Question) private readonly questionRepository: Repository<Question>,
    @InjectEntityManager() private readonly manager: EntityManager,
  ) {}

  create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    return this.manager.transaction(async (manager) => {
      const userId = createQuestionDto.user.id;
      const existingUser = await manager.findOne(User, userId);
      if (!existingUser)
        throw new NotFoundException(`User with id ${userId} was not found`);
      let newQuestion: Question;
      if (!createQuestionDto.keywords || createQuestionDto.keywords.length == 0) { // if the question doesn't have keywords
        newQuestion = manager.create(Question, createQuestionDto);
      } else {
        // if the question has keywords
        const keywordIds = createQuestionDto.keywords.map(
          (keyword) => keyword.id,
        );
        const keywords: Keyword[] = [];
        let tempKeyword: Keyword;
        for (let i = 0; i < keywordIds.length; i++) {
          const id = keywordIds[i];
          tempKeyword = await manager.findOne(Keyword, id);
          if (!tempKeyword)
            throw new NotFoundException(`Keyword with ${id} was not found`);
          keywords.push(tempKeyword);
        }
        createQuestionDto.keywords = keywords;
        newQuestion = manager.create(Question, createQuestionDto);
        // newQuestion.keywords = keywords;
      }
      return manager.save(newQuestion);
    });
  }

  findAll(): Promise<Question[]> {
    return this.questionRepository.find();
  }

  findOne(id: number): Promise<Question> {
    return this.questionRepository.findOne(id, {
      relations: ['answers', 'user', 'keywords'],
    });
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    return this.manager.transaction(async (manager) => {
      const existingQuestion = await manager.findOne(Question, id);
      if (!existingQuestion)
        throw new NotFoundException(`Question with id ${id} was not found`);
      manager.merge(Question, existingQuestion, updateQuestionDto);
      return manager.save(existingQuestion);
    });
  }

  remove(id: number): Promise<void> {
    return this.manager.transaction(async (manager) => {
      const existingQuestion = await manager.findOne(Question, id);
      if (!existingQuestion)
        throw new NotFoundException(`Question with id ${id} was not found`);
      await manager.delete(Question, id);
    });
  }

  findByKeyword(keywordIds: number[], pageSize?: number, pageNr?: number) {
    return this.manager.transaction(async (manager) => {
      const keywords: Keyword[] = [];
      // const keywordIds: number[] = [];
      let tempKeyword: Keyword;
      for (let i = 0; i < keywordIds.length; i++) {
        const id = keywordIds[i];
        tempKeyword = await manager.findOne(Keyword, id);
        if (!tempKeyword)
          throw new NotFoundException(`Keyword with id ${id} was not found`);
        keywords.push(tempKeyword);
      }
      const keywordString = '(' + keywordIds.toString() + ')';
      const keywordCount = keywordIds.length;
      const queryString = `SELECT "rel"."questionId" 
       FROM "question_keywords_keyword" "rel" 
       WHERE "rel"."keywordId" IN ${keywordString} 
       GROUP BY "rel"."questionId"
       HAVING COUNT(DISTINCT "rel"."keywordId") = ${keywordCount}`;
      let questionIdObjs;
      if (typeof pageSize === 'undefined' || typeof pageNr === 'undefined') {
        questionIdObjs = await manager.query(queryString);
      } else {
        questionIdObjs = await manager.query(
          queryString +
            ` LIMIT ${pageSize}` +
            ` OFFSET ${(pageNr - 1) * pageSize}`,
        );
      }
      const questionIds = questionIdObjs.map((idObj) => {
        return idObj.questionId;
      });
      const res: QuestionWithAnsCount[] = [];
      const questions = await manager.findByIds(Question, questionIds, {
        relations: ['keywords', 'user'],
      });
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const [, ansCount] = await manager.findAndCount(Answer, {
          where: { question: question.id },
        });
        res.push(new QuestionWithAnsCount(question, ansCount));
      }
      return res;
    });
  }

  count(): Promise<number> {
    return this.questionRepository.count();
  }

  countByKeyword(keywordIds: number[]): Promise<number> {
    return this.manager.transaction(async (manager) => {
      const keywords: Keyword[] = [];
      let tempKeyword: Keyword;
      for (let i = 0; i < keywordIds.length; i++) {
        const id = keywordIds[i];
        tempKeyword = await manager.findOne(Keyword, id);
        if (!tempKeyword)
          throw new NotFoundException(`Keyword with id ${id} was not found`);
        keywords.push(tempKeyword);
      }
      const keywordString = '(' + keywordIds.toString() + ')';
      const keywordCount = keywordIds.length;
      const queryString = `SELECT COUNT(*) FROM
       (SELECT "rel"."questionId" 
       FROM "question_keywords_keyword" "rel" 
       WHERE "rel"."keywordId" IN ${keywordString} 
       GROUP BY "rel"."questionId"
       HAVING COUNT(DISTINCT "rel"."keywordId") = ${keywordCount}) AS "ids"`;
      const questionCountObj = await manager.query(queryString);
      return questionCountObj[0].count;
    });
  }

  getPage(pageSize: number, pageNr: number): Promise<QuestionWithAnsCount[]> {
    return this.manager.transaction(async (manager) => {
      const questions = await manager.find(Question, {
        order: { askedOn: 'DESC' },
        take: pageSize,
        skip: (pageNr - 1) * pageSize,
        relations: ['keywords', 'user'],
      });
      const res: QuestionWithAnsCount[] = [];
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const [, ansCount] = await manager.findAndCount(Answer, {
          where: { question: question.id },
        });
        res.push(new QuestionWithAnsCount(question, ansCount));
      }
      return res;
    });
  }

  getInfo(id: number): Promise<AllQuestionInfo> {
    return this.manager.transaction(async (manager) => {
      const question = await manager.findOne(Question, id, {
        relations: ['answers', 'keywords', 'user'],
      });
      const retVal = new AllQuestionInfo(question);

      for (let i = 0; i < question.answers.length; i++) {
        const answer = question.answers[i];
        const queryString = `SELECT "user"."displayName" FROM "answer"
          JOIN "user" ON "answer"."user_id" = "user"."id"
          WHERE "answer"."id" = ${answer.id}`;
        const authorName = await this.manager.query(queryString);
        retVal.answers.push(
          new AnswerWithAuthorName(answer, authorName[0].displayName),
        );
      }
      return retVal;
    });
  }

  countByYear(year: number, id: number): Promise<any> {
    const fromDate = year.toString() + '-01-01';
    const toDate = (year + 1).toString() + '-01-01';
    const queryString =
      `SELECT COUNT(*) as count, date_trunc('day', "askedOn") as day ` +
      `FROM "question" WHERE "askedOn">='${fromDate}' ` +
      `AND "askedOn"<'${toDate}' ` +
      (isNaN(id) ? '' : `AND "user_id" = ${id} `) +
      `GROUP BY day`;
    return this.manager.query(queryString);
  }

  async byAnswers(ids: number[]): Promise<any> {
    const queryIds = '(' + ids.toString() + ')';
    const queryString = `SELECT "q"."title", "q"."id" "question_id", "a"."answeredOn", "a"."id" as "answer_id"
      FROM "question" "q"
      JOIN "answer" "a" ON "a"."question_id" = "q"."id"
      WHERE "a"."id" IN ${queryIds} ORDER BY "a"."answeredOn" DESC`;
    return await this.manager.query(queryString);
  }
}
