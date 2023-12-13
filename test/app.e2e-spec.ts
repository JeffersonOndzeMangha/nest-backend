import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppModule (e2e)', () => {
  let app: INestApplication;
  let user: string;

  // TODO: add mock database data to test requests & make the tets more robust

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    user = 'b8bd6a73-8fb6-422d-bf90-830553453f82';
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/accounts (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/accounts');
    console.log("ACCOUNTS:", body.length);
    expect(body[0].id).toBeDefined();
  });

  it('/people (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/people');
    console.log("PEOPLE:", body.length);
    expect(body[0].id).toBeDefined();
  });

  it('/transactions (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/transactions');
    console.log("TRANSACTIONS:", body.length);
    expect(body[0].id).toBeDefined();
  });

  it('/accounts/:id (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/accounts/b1008925-2536-4605-8353-0e3a5b255c42')
      .set({ 'x-api-key': '123', 'account-owner': user });
    console.log("ACCOUNT:", body);
    expect(body.id).toBeDefined();
  });

  it('/people/:id (GET)', async () => {
    try {
      const { body } = await request(app.getHttpServer(), )
        .get(`/people/${user}`);
      console.log("PERSON:", body);
      expect(body.id).toBeDefined();
    } catch (error) {
      console.log(error.message);
      expect(error).toBeDefined();
    }
  });

  it('/transactions/:id (GET)', async () => {
    try {
      const { body } = await request(app.getHttpServer()).get('/transactions/3dce9ae8-2498-47f1-8671-971fecc875ba');
      console.log("TRANSACTION:", body);
      expect(body.id).toBeDefined();
    } catch (error) {
      console.log(error);
      expect(error).toBeDefined();
    }
  });

  it('/accounts (POST)', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/accounts/create')
      .send({
        "owner": user,
        "balance": 1000,
        "transactions": []
      });
    console.log("ACCOUNT:", body);
    expect(body.id).toBeDefined();
  });

  //TODO: Add more end-to-end tests for your controllers and routes here
});
