import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { APP_NAME } from '../constants';

export class RequestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const logger =  new Logger(APP_NAME)
    const startTime = performance.now();

    res.on('finish', () => {
      const endTime = performance.now();
      const responseTimeInMs = (endTime - startTime)?.toFixed(3);

      logger.log({
        method: req?.method,
        url: req?.url,
        headers: req?.headers,
        query: req?.query,
        body: req?.body,
        responseTime: `${responseTimeInMs} ms`,
        statusCode: res?.statusCode,
      });
    });

    next();
  }
}