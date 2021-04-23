import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from '../src/answer/entities/answer.entity';
import { Keyword } from '../src/keyword/entities/keyword.entity';
import { Question } from '../src/question/entities/question.entity';
import { User } from '../src/user/entities/user.entity';
import { UserModule } from '../src/user/user.module';
import { KeywordModule } from '../src/keyword/keyword.module';
import { AnswerModule } from '../src/answer/answer.module';
import { QuestionModule } from '../src/question/question.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

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
        UserModule,
        KeywordModule,
        AnswerModule,
        QuestionModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/user').expect(200).expect([]);
  });
});
