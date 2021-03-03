import { Express, Router } from 'express';
import fastGlob from 'fast-glob';
import { readdirSync } from 'fs';

export default (app: Express): void => {
  // Tip: Use import dynamicly
  const router = Router();

  app.use('/api', router);

  readdirSync(`${__dirname}/../routes`).map(async file => {
    if (!file.includes('.test.') && !file.endsWith('.map')) {
      (await import(`../routes/${file}`)).default(router);
    }
  });
};
