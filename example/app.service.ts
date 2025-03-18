import { Injectable, Logger } from '@nestjs/common';
import { TraceIdHandler,  } from '../src';

@Injectable()
export class AppService {
  constructor() { }
  private readonly logger = new Logger(AppService.name);

  async getWorld() {
    await new Promise((res) => setTimeout(res, 300));
    this.logger.error('Hello from AppService!');

    const hello = await this.hello()

    return {
      hello: 'world',
      traceId: TraceIdHandler.getTraceId(),
      world: hello
    }
  }

  async hello() {

    await new Promise((res) => setTimeout(res, 3000));
    return 'hello'
  }
}