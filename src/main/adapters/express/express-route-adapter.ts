import { Request, Response } from 'express';
import { Controller, HttpRequest } from '../../../presentation/protocols';

export const adatperRoute = (controller: Controller) => {
  return async (req: Request, res: Response): Promise<void> => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      accountId: req.accountId,
    };

    const httpResponse = await controller.handle(httpRequest);

    const { statusCode, body } = httpResponse;

    if (statusCode >= 200 && statusCode < 300) {
      res.status(statusCode).json(body);
    } else {
      res.status(statusCode).json({ error: body.message });
    }
  };
};
