import { Controller, Get, Logger,  } from '@nestjs/common';
import { AppService } from './app.service';
import {  TraceIdHandler } from '../src';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @Get()
  async getHello() {
    this.logger.debug({
        traceId: TraceIdHandler.getTraceId()
    });
    return this.appService.getWorld();
  }
  
}