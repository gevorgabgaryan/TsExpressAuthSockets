import request from 'supertest';
import { API } from '../../src/api';
import { TypeORM } from '../../src/db';
import http from 'http';
import { UserRepository } from '../../src/api/repositories/UserRepository';
import { MailService } from '../../src/api/services/MailService';
import Container from 'typedi';
import MockMailService from '../utils/MaileServiceMock';


Container.set(MailService, new MockMailService());

let server: http.Server;
let userToken: string;
let newUserEmail = 'newuser@example.com';
let newUserPassword = 'Password123!';

beforeAll(async () => {
    await TypeORM.init();
    server = await API.init();
});

afterAll(async () => {
    await TypeORM.close();
    await API.close();
});

describe('Auth Workflow Tests', () => {

    test('Register a new user', async () => {
        const response = await request(server)
            .post('/api/auth/register')
            .send({
              firstName: 'Test',
              lastName: 'User',
              email: newUserEmail,
              password: newUserPassword
          });

        expect(response.statusCode).toBe(200);
        expect(response.body.email).toEqual(newUserEmail);
    });

    test('Confirm email of the new user', async () => {
        const confirmationToken = await getUserConfirmationToken(newUserEmail);
        const response = await request(server)
            .post('/api/auth/confirm-email')
            .send({
                token: confirmationToken
            });

        expect(response.statusCode).toBe(204);
    });

    test('Login with the new user', async () => {
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                email: newUserEmail,
                password: newUserPassword
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
        userToken = response.body.token;
    });

    test('Logout the user', async () => {
        const response = await request(server)
            .get('/api/auth/logout')
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.statusCode).toBe(204);
    });
});


const getUserConfirmationToken = async (emailAddress: string): Promise<string | null> => {
  const user = await UserRepository.findByEmail(emailAddress);
  return user?.verificationToken || null;
};

