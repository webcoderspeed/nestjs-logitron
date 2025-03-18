/** @format */

import {
	DynamicModule,
	Global,
	Inject,
	MiddlewareConsumer,
	Module,
	NestModule,
	Provider,
	RequestMethod,
} from '@nestjs/common';
import { IParams, LoggerModuleAsyncParams, PARAMS_PROVIDER_TOKEN } from '../utils/params';
import { LoggerService } from '../services';
import { RequestMiddleware, TraceMiddleware } from '../middlewares';

const DEFAULT_ROUTES = [{ path: '*', method: RequestMethod.ALL }];

@Global()
@Module({})
export class LoggerModule implements NestModule {
	static forRoot(params?: IParams | undefined): DynamicModule {
		const paramsProvider: Provider<IParams> = {
			provide: PARAMS_PROVIDER_TOKEN,
			useValue: params ?? {},
		};

		return {
			module: LoggerModule,
			providers: [
				paramsProvider,
				{
					provide: LoggerService,
					useFactory: (params: IParams) => new LoggerService(params),
					inject: [PARAMS_PROVIDER_TOKEN],
				},
			],
			exports: [LoggerService],
		};
	}

	static forRootAsync(params: LoggerModuleAsyncParams): DynamicModule {
		const paramsProvider: Provider<IParams | Promise<IParams>> = {
			provide: PARAMS_PROVIDER_TOKEN,
			useFactory: params.useFactory,
			inject: params.inject,
		};

		const providers: any[] = [
			paramsProvider,
			{
				provide: LoggerService,
				useFactory: async (params: IParams) => new LoggerService(await params),
				inject: [PARAMS_PROVIDER_TOKEN],
			},
			...(params.providers || []),
		];

		return {
			module: LoggerModule,
			imports: params.imports,
			providers,
			exports: [LoggerService],
		};
	}

	constructor(
		@Inject(PARAMS_PROVIDER_TOKEN)
		private readonly params: IParams,
	) {}

	configure(consumer: MiddlewareConsumer) {
		const { forRoutes = DEFAULT_ROUTES, exclude } = this.params;

		const middlewares = [TraceMiddleware, RequestMiddleware];

		if (exclude) {
			consumer
				.apply(...middlewares)
				.exclude(...exclude)
				.forRoutes(...forRoutes);
		} else {
			consumer.apply(...middlewares).forRoutes(...forRoutes);
		}
	}
}
