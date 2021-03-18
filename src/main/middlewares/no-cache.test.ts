import request from 'supertest';
import app from '../config/app';
import { noCache } from './no-cache';

describe('NoCache Middleware', () => {
  test('should enable cors', async () => {
    app.get('/no-cache', noCache, (req, res) => {
      res.send(req.body);
    });

    await request(app)
      .get('/no-cache')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store')
      .expect(
        'cache-control',
        'no-store, no-cache, must-revalidate, proxy-reavlidate',
      );
  });
});
