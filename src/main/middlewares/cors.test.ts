import request from 'supertest';
import app from '../config/app';

describe('CORS Middleware', () => {
  test('should enable cors', async () => {
    app.post('/test_cors', (req, res) => {
      res.send(req.body);
    });

    await request(app)
      .get('/test_body_parser')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*');
  });
});
