import request from 'supertest';
import app from '../config/app';

describe('Bodyparser Middleware', () => {
  test('should return content sended in the body of the request', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body);
    });

    await request(app)
      .post('/test_body_parser')
      .send({ content: 'content' })
      .expect({ content: 'content' });
  });
});
