import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from '../src/answer/entities/answer.entity';
import { Keyword } from '../src/keyword/entities/keyword.entity';
import { Question } from '../src/question/entities/question.entity';
import { User } from '../src/user/entities/user.entity';
import { QuestionModule } from '../src/question/question.module';
import { UserService } from '../src/user/user.service';
import { Dummies } from './testDummies';
import { KeywordService } from '../src/keyword/keyword.service';
import { UserModule } from '../src/user/user.module';
import { KeywordModule } from '../src/keyword/keyword.module';

describe('QuestionModule (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let keywordService: KeywordService;

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
        QuestionModule,
        UserModule,
        KeywordModule,
      ],
      providers: [UserService, KeywordService],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = app.get<UserService>(UserService);
    keywordService = app.get<KeywordService>(KeywordService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/question (GET) | initially no questions', () => {
    return request(app.getHttpServer()).get('/question').expect(200).expect([]);
  });

  it('/question (POST) | well-formed question is accepted', async () => {
    await userService.create(Dummies.user);
    await keywordService.create(Dummies.keywordOfUser1);
    await keywordService.create(Dummies.keywordSimple);
    const result = await request(app.getHttpServer())
      .post('/question')
      .send(Dummies.question)
      .expect(201);
    const newKeywords = [
      { id: 1, name: 'Test keyword with user' },
      { id: 2, name: 'Simple Keyword' },
    ];
    expect(result.body).toEqual({
      title: Dummies.question.title,
      questContent: Dummies.question.questContent,
      user: Dummies.question.user,
      keywords: newKeywords,
      id: 1,
      askedOn: expect.any(String),
    });
    expect(isNaN(Date.parse(result.body.askedOn))).toEqual(false);
  });

  it('/question/count (GET) | should return 1', async () => {
    const result = await request(app.getHttpServer())
      .get('/question/count')
      .expect(200);
    // console.log(result);
    expect(result.text).toEqual('1');
  });

  it('/question/{:id} (GET) | previously added question is returned', async () => {
    const result = await request(app.getHttpServer())
      .get('/question/1')
      .expect(200);
    const createdUser = Object.assign({ id: 1 }, Dummies.user);
    // console.log(createdUser);
    expect(result.body).toEqual({
      title: Dummies.question.title,
      questContent: Dummies.question.questContent,
      user: createdUser,
      id: 1,
      askedOn: expect.any(String),
      answers: [],
      keywords: [
        {
          id: 1,
          name: Dummies.keywordOfUser1.name,
        },
        {
          id: 2,
          name: Dummies.keywordSimple.name,
        },
      ],
    });
    expect(isNaN(Date.parse(result.body.askedOn))).toEqual(false);
  });

  it('/question (GET) | should find one question', async () => {
    const result = await request(app.getHttpServer())
      .get('/question')
      .expect(200);
    expect(result.body).toEqual([
      {
        id: 1,
        askedOn: expect.any(String),
        questContent: Dummies.question.questContent,
        title: Dummies.question.title,
      },
    ]);
    expect(isNaN(Date.parse(result.body[0].askedOn))).toEqual(false);
  });

  it('/question/by/keyword (GET) | should return questions containing the keywords provided', async () => {
    const result = await request(app.getHttpServer())
      .get('/question/by/keyword?id=1,2')
      .expect(200);
    expect(result.body).toEqual([
      {
        id: 1,
        title: Dummies.question.title,
        questContent: Dummies.question.questContent,
        askedOn: expect.any(String),
        keywords: [
          {
            id: 1,
            name: Dummies.keywordOfUser1.name,
          },
          {
            id: 2,
            name: Dummies.keywordSimple.name,
          },
        ],
        user: {
          id: 1,
          displayName: Dummies.user.displayName,
          email: Dummies.user.email,
          password: Dummies.user.password,
        }
      },
    ]);
    expect(isNaN(Date.parse(result.body[0].askedOn))).toEqual(false);
  });

  it('/question/{:id} (PATCH) | should return updated question', async () => {
    const newContent = 'This is the new question content';
    const result = await request(app.getHttpServer())
      .patch('/question/1')
      .send({ questContent: newContent })
      .expect(200);
    expect(result.body).toEqual({
      id: 1,
      title: Dummies.question.title,
      questContent: newContent,
      askedOn: expect.any(String),
    });
    expect(isNaN(Date.parse(result.body.askedOn))).toEqual(false);
  });

  it('/question/{:id} (DELETE) | should return ok', async () => {
    await request(app.getHttpServer()).delete('/question/1').expect(200);
    return request(app.getHttpServer())
      .get('/question/1')
      .expect(200)
      .expect({});
  });
});
