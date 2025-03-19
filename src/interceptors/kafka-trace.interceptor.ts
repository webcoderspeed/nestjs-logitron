/** @format */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TraceIdHandler, withTraceId } from '../utils';

@Injectable()
export class KafkaTraceInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler) {
		const payload = context.switchToRpc().getData();

		const traceId = payload?.[TraceIdHandler.getTraceIdField()];

		return new Observable((subscriber) => {
			withTraceId(traceId, () => {
				next.handle().subscribe({
					next: (value) => subscriber.next(value),
					error: (err) => subscriber.error(err),
					complete: () => subscriber.complete(),
				});
			});
		});
	}
}
