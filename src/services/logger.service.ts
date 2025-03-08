/* eslint-disable @typescript-eslint/no-explicit-unknown */
import {
    Injectable,
    LoggerService as NestjsLoggerService,
  } from '@nestjs/common';
  import { ILogger, ILoggerOptions, LoggerType } from '../types';
  import speedCache from '../db';
  import { LOGGER_OPTIONS } from '../constants';
import { getLogger } from '../factory';
  
  @Injectable()
  export class LoggerService implements NestjsLoggerService, ILogger {
    private logger: ILogger;

    constructor(
        options: ILoggerOptions = {
            type: LoggerType.PINO,
        },
    ) {
        this.logger = getLogger(options);
        speedCache.set(LOGGER_OPTIONS, options);
    }

    log(...optionalParams: any[]) {
        this.logger.info(...optionalParams);
    }

    info(...optionalParams: any[]): void {
        this.logger.info(...optionalParams);
    }

    warn(...optionalParams: any[]): void {
        this.logger.warn(...optionalParams);
    }

    error(...optionalParams: any[]): void {
        this.logger.error(...optionalParams);
    }

    debug(...optionalParams: any[]): void {
        this.logger.debug(...optionalParams);
    }
  }