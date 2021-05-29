import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dummies } from './testDummies';
import { KeywordModule } from '../src/keyword/keyword.module';
import { UserService } from '../src/user/user.service';
import { UserModule } from '../src/user/user.module';
import { Answer } from '../src/answer/entities/answer.entity';
import { Keyword } from '../src/keyword/entities/keyword.entity';
import { Question } from '../src/question/entities/question.entity';
import { User } from '../src/user/entities/user.entity';

describe('KeywordModule (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;

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
        KeywordModule,
        UserModule,
      ],
      providers: [UserService],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = app.get<UserService>(UserService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/keyword (GET) | initially no answers', () => {
    return request(app.getHttpServer()).get('/keyword').expect(200).expect([]);
  });

  it('/keyword (POST) | well-formed keyword is accepted', async () => {
    await userService.create(Dummies.user);
    const result = await request(app.getHttpServer())
      .post('/keyword')
      .send(Dummies.keywordOfUser1)
      .expect(201);
    expect(result.body).toEqual(
      Object.assign({ id: 1 }, Dummies.keywordOfUser1),
    );
  });

  it('/keyword/count (GET) | should return 1', async () => {
    const result = await request(app.getHttpServer())
      .get('/keyword/count')
      .expect(200);
    // console.log(result);
    expect(result.text).toEqual('1');
  });

  it('/keyword/{:id} (GET) | previously added keyword is returned', async () => {
    const result = await request(app.getHttpServer())
      .get('/keyword/1')
      .expect(200);
    const createdUser = Object.assign({ id: 1 }, Dummies.user);
    expect(result.body).toEqual({
      id: 1,
      name: Dummies.keywordOfUser1.name,
      user: createdUser,
    });
  });

  it('/keyword (GET) | should find one keyword', async () => {
    const result = await request(app.getHttpServer())
      .get('/keyword')
      .expect(200);
    expect(result.body).toEqual([
      {
        id: 1,
        name: Dummies.keywordOfUser1.name,
      },
    ]);
  });

  it('/keyword/{:id} (PATCH) | should return updated keyword', async () => {
    const newName = 'this is the new keyword name';
    const result = await request(app.getHttpServer())
      .patch('/keyword/1')
      .send({ name: newName })
      .expect(200);
    expect(result.body).toEqual({ id: 1, name: newName });
  });

  it('/keyword/{:id} (DELTE) | should return ok', async () => {
    await request(app.getHttpServer()).delete('/keyword/1').expect(200);
    return request(app.getHttpServer())
      .get('/keyword/1')
      .expect(200)
      .expect({});
  });
});
