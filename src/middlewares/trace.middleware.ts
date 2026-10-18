/** @format */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TraceIdHandler, withTraceId } from '../utils';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
	use(req: Request, _: Response, next: NextFunction) {
		const traceId =
			(req?.headers?.[TraceIdHandler.getTraceIdField()] as string) ??
			(req?.body?.[TraceIdHandler.getTraceIdField()] as string) ??
			(req?.query?.[TraceIdHandler.getTraceIdField()] as string)

		withTraceId(traceId, () => next());
	}
}
