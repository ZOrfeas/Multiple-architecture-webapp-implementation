import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from '../src/answer/entities/answer.entity';
import { Keyword } from '../src/keyword/entities/keyword.entity';
import { Question } from '../src/question/entities/question.entity';
import { User } from '../src/user/entities/user.entity';
import { UserModule } from '../src/user/user.module';

describe('UserController (e2e)', () => {
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

  const new_user = {
    displayName: 'Kostas',
    email: 'kost.kost@kost.com',
    password: 'testpasswordhaha',
  };
  it('/user (POST) | well-formed user is accepted', async () => {
    const result = await request(app.getHttpServer())
      .post('/user')
      .send(new_user)
      .expect(201);
    expect(result.body).toEqual({
      id: 1,
      displayName: new_user.displayName,
      email: new_user.email,
      password: new_user.password,
    });
  });

  it('/user/{:id} (GET) | previously added user is returned', async () => {
    const result = await request(app.getHttpServer())
      .get('/user/1')
      .expect(200);
    expect(result.body).toEqual({
      id: 1,
      displayName: new_user.displayName,
      email: new_user.email,
      password: new_user.password,
      questions: [],
      answers: [],
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
          displayName: new_user.displayName,
          email: new_user.email,
          password: new_user.password,
        },
      ]);
  });

  it('/user/{:id} (PATCH) | should return updated user', () => {
    const new_name = 'new_test_name';
    return request(app.getHttpServer())
      .patch('/user/1')
      .send({ displayName: new_name })
      .expect(200)
      .expect({
        id: 1,
        displayName: new_name,
        email: new_user.email,
        password: new_user.password,
      });
  });

  it('/user/{:id} (DELETE) | should return ok', () => {
    request(app.getHttpServer()).delete('/user/1').expect(200);
    return request(app.getHttpServer()).get('/user/5').expect(200).expect({});
  });
});
