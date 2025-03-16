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

	log(message: string, ...optionalParams: any[]): void {
		this.logger.info(message, ...optionalParams);
	}

	info(message: string, ...optionalParams: any[]): void {
		this.logger.info(message, ...optionalParams);
	}

	warn(message: string, ...optionalParams: any[]): void {
		this.logger.warn(message, ...optionalParams);
	}

	error(message: string, ...optionalParams: any[]): void {
		this.logger.error(message, ...optionalParams);
	}

	debug(message: string, ...optionalParams: any[]): void {
		this.logger.debug(message, ...optionalParams);
	}

	infoWithExecutionTime(message: string, execution: { name: string; start: number }, ...optionalParams: any[]): void {
		this.logger.infoWithExecutionTime(message, execution, ...optionalParams);
	}
	warnWithExecutionTime(message: string, execution: { name: string; start: number }, ...optionalParams: any[]): void {
		this.logger.warnWithExecutionTime(message, execution, ...optionalParams);
	}
	errorWithExecutionTime(message: string, execution: { name: string; start: number }, ...optionalParams: any[]): void {
		this.logger.errorWithExecutionTime(message, execution, ...optionalParams);
	}
	debugWithExecutionTime(message: string, execution: { name: string; start: number }, ...optionalParams: any[]): void {
		this.logger.debugWithExecutionTime(message, execution, ...optionalParams);
	}
  }