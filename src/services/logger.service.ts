import {
    Injectable,
    LoggerService as NestjsLoggerService,
  } from '@nestjs/common';
  import { ILogger, ILoggerOptions } from '../types';
import { getLogger } from '../factory';
  
  @Injectable()
  export class LoggerService implements NestjsLoggerService, ILogger {
    private logger: ILogger;

    constructor(
        options: ILoggerOptions
    ) {
        this.logger = getLogger(options);
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