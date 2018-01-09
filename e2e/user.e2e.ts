import * as request from 'supertest';
import app from '../src/app';

describe('GET /users/:id', () => {
    it('should return 200 OK', () => {
        return request(app).get('/v1/api/users/1')
            .expect(200);
    });
});
