import { Controller, Get, Logger,  } from '@nestjs/common';
import { AppService } from './app.service';
import {  TraceIdHandler,  } from '../src';

@Controller('hello')
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger();

  @Get()
  async getHello() {
    this.logger.error('Trace Id',{
        traceId: TraceIdHandler.getTraceId()
    });
    return this.appService.getWorld();
  }
  
}