/** @format */

import { ModuleMetadata } from '@nestjs/common';
import { ILogger, ILoggerOptions } from '../types';
import { InjectionToken, MiddlewareConfigProxy, OptionalFactoryDependency } from '@nestjs/common/interfaces';
import { APP_NAME } from '../constants';

export type IParams = ILoggerOptions & {
	forRoutes?: Parameters<MiddlewareConfigProxy['forRoutes']>;
	exclude?: Parameters<MiddlewareConfigProxy['exclude']>;
};

export interface LoggerModuleAsyncParams extends Pick<ModuleMetadata, 'imports' | 'providers'> {
	useFactory: (...args: unknown[]) => ILoggerOptions | Promise<ILoggerOptions>;
	inject?: Array<InjectionToken | OptionalFactoryDependency>;
}

export const PARAMS_PROVIDER_TOKEN = APP_NAME;
export type PassedLogger = { logger: ILogger };
