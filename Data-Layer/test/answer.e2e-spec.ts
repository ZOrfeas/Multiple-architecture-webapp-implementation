import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dummies } from './testDummies';
import { UserService } from '../src/user/user.service';
import { QuestionService } from '../src/question/question.service';
import { AnswerModule } from '../src/answer/answer.module';
import { QuestionModule } from '../src/question/question.module';
import { UserModule } from '../src/user/user.module';
import { Answer } from '../src/answer/entities/answer.entity';
import { Keyword } from '../src/keyword/entities/keyword.entity';
import { Question } from '../src/question/entities/question.entity';
import { User } from '../src/user/entities/user.entity';

describe('AnswerModule (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let questionService: QuestionService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Answer, Question, Keyword],
          logging: false,
          synchronize: true,
        }),
        AnswerModule,
        QuestionModule,
        UserModule,
      ],
      providers: [UserService, QuestionService],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = app.get<UserService>(UserService);
    questionService = app.get<QuestionService>(QuestionService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/answer (GET) | initally no answers', () => {
    return request(app.getHttpServer()).get('/answer').expect(200).expect([]);
  });

  it('/answer (POST) | well-formed answer is accepted', async () => {
    await userService.create(Dummies.user);
    await questionService.create(Dummies.questionWithoutKeywords);
    const result = await request(app.getHttpServer())
      .post('/answer')
      .send(Dummies.answer)
      .expect(201);
    expect(result.body).toEqual({
      ansContent: Dummies.answer.ansContent,
      user: Dummies.answer.user,
      question: Dummies.answer.question,
      id: 1,
      answeredOn: expect.any(String),
    });
    expect(isNaN(Date.parse(result.body.answeredOn))).toEqual(false);
  });

  it('/answer/{:id} (GET) | previously added answer is returned', async () => {
    const result = await request(app.getHttpServer())
      .get('/answer/1')
      .expect(200);
    const createdUser = Object.assign({ id: 1 }, Dummies.user);
    const createdQuestion = {
      id: 1,
      title: Dummies.questionWithoutKeywords.title,
      questContent: Dummies.questionWithoutKeywords.questContent,
      askedOn: expect.any(String),
    };
    expect(result.body).toEqual({
      id: 1,
      ansContent: Dummies.answer.ansContent,
      answeredOn: expect.any(String),
      user: createdUser,
      question: createdQuestion,
    });
    expect(isNaN(Date.parse(result.body.answeredOn))).toEqual(false);
  });

  it('/answer (GET) | should find one question', async () => {
    const result = await request(app.getHttpServer())
      .get('/answer')
      .expect(200);
    expect(result.body).toEqual([
      {
        id: 1,
        ansContent: Dummies.answer.ansContent,
        answeredOn: expect.any(String),
      },
    ]);
    expect(isNaN(Date.parse(result.body[0].answeredOn))).toEqual(false);
  });

  it('/answer/{:id} (PATCH) | should return updated answer', async () => {
    const newContent = 'This is the new answer Content';
    const result = await request(app.getHttpServer())
      .patch('/answer/1')
      .send({ ansContent: newContent })
      .expect(200);
    expect(result.body).toEqual({
      id: 1,
      ansContent: newContent,
      answeredOn: expect.any(String),
    });
    expect(isNaN(Date.parse(result.body.answeredOn))).toEqual(false);
  });

  it('/answer/{:id} (DELETE) | should return ok', async () => {
    await request(app.getHttpServer()).delete('/answer/1').expect(200);
    return request(app.getHttpServer()).get('/answer/1').expect(200).expect({});
  });
});
