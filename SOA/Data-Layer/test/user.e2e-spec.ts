import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from '../src/answer/entities/answer.entity';
import { Keyword } from '../src/keyword/entities/keyword.entity';
import { Question } from '../src/question/entities/question.entity';
import { User } from '../src/user/entities/user.entity';
import { UserModule } from '../src/user/user.module';
import { Dummies } from './testDummies';

describe('UserModule (e2e)', () => {
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
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/user (GET) | initially no users', () => {
    return request(app.getHttpServer()).get('/user').expect(200).expect([]);
  });

  it('/user (POST) | well-formed user is accepted', async () => {
    const result = await request(app.getHttpServer())
      .post('/user')
      .send(Dummies.user)
      .expect(201);
    expect(result.body).toEqual({
      id: 1,
      displayName: Dummies.user.displayName,
      email: Dummies.user.email,
      password: Dummies.user.password,
    });
  });

  it('/user/{:id} (GET) | previously added user is returned', async () => {
    const result = await request(app.getHttpServer())
      .get('/user/1')
      .expect(200);
    expect(result.body).toEqual({
      id: 1,
      displayName: Dummies.user.displayName,
      email: Dummies.user.email,
      password: Dummies.user.password,
      questions: [],
      answers: [],
      keyword: null,
    });
  });

  it('/user/by-email (POST) | previously added user is returned', async () => {
    const result = await request(app.getHttpServer())
      .post('/user/by-email')
      .send(Dummies.userByEmail)
      .expect(200);
    expect(result.body).toEqual({
      id: 1,
      displayName: Dummies.user.displayName,
      email: Dummies.user.email,
      password: Dummies.user.password,
      keyword: null,
    });
  });

  it('/user (GET) | should find one user', () => {
    return request(app.getHttpServer())
      .get('/user')
      .expect(200)
      .expect([
        {
          id: 1,
          displayName: Dummies.user.displayName,
          email: Dummies.user.email,
          password: Dummies.user.password,
        },
      ]);
  });

  it('/user/{:id} (PATCH) | should return updated user', () => {
    const newName = 'new_test_name';
    return request(app.getHttpServer())
      .patch('/user/1')
      .send({ displayName: newName })
      .expect(200)
      .expect({
        id: 1,
        displayName: newName,
        email: Dummies.user.email,
        password: Dummies.user.password,
      });
  });

  it('/user/{:id} (DELETE) | should return ok', async () => {
    await request(app.getHttpServer()).delete('/user/1').expect(200);
    return request(app.getHttpServer()).get('/user/1').expect(200).expect({});
  });
});
