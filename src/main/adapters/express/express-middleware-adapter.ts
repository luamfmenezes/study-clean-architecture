import { NextFunction, Request, Response } from 'express';
import { HttpRequest, Middleware } from '../../../presentation/protocols';

export const adaptMiddleware = (middleware: Middleware) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const httpRequest: HttpRequest = {
      headers: req.headers,
    };
    const httpResponse = await middleware.handle(httpRequest);

    const { statusCode, body } = httpResponse;

    Object.assign(req, httpResponse.body);
    if (statusCode === 200) {
      next();
    } else {
      res.status(statusCode).json({ error: body.message });
    }
  };
};
