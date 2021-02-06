import { Request, Response } from 'express';
import { Controller, HttpRequest } from '../../presentation/protocols';

export const adatperRoute = (controller: Controller) => {
  return async (req: Request, res: Response): Promise<void> => {
    const httpRequest: HttpRequest = {
      body: req.body,
    };

    const httpResponse = await controller.handle(httpRequest);

    const { statusCode, body } = httpResponse;

    res.status(statusCode).json(body);
  };
};
