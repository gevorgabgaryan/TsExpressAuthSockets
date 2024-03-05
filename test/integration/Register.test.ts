import request from 'supertest';
import { API } from "../../src/api";
import { TypeORM } from "../../src/db";
import http from 'http';
import Container from 'typedi';
import { MailService } from '../../src/api/services/MailService';
import MockMailService from '../utils/MaileServiceMock';
import config from '../../src/config';


let server: http.Server;

beforeAll(async () => {
    await TypeORM.init();
    server = await API.init();
    Container.set(MailService, new MockMailService());
});

afterAll(async () => {
  await TypeORM.close();
  await API.close();
});

describe('User Registration Integration Tests', () => {

  test('Successful registration', async () => {
    const response = await request(server)
      .post('/api/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: config.testUser,
        password: config.testPassword,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  test('Registration with existing email', async () => {
   const response = await request(server)
      .post('/api/auth/register')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: config.testUser,
        password: config.testPassword,
      });

    expect(response.statusCode).toBe(500);

  });

  test('Registration with invalid email', async () => {
    const response = await request(server)
      .post('/api/auth/register')
      .send({
        firstName: 'Invalid',
        lastName: 'Email',
        email: config.testUser.slice(0, 3),
        password: config.testPassword,
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('name', 'BadRequestError');

  });

});