# NestJS Logitron

A lightweight, high-performance logging utility for NestJS applications, built on Pino and Winston, with execution time tracking and request tracing.

## Features

- 🚀 **Execution Time Tracking**: Log the execution time of methods and controllers.
- 📜 **Request Logging Middleware**: Log incoming requests with metadata.
- 📍 **Trace Middleware**: Add request tracing using unique identifiers.
- 🏗 **Logger Factory**: Create custom loggers easily.
- 🎯 **Flexible Logger Configuration**: Supports Pino and Winston with custom transports.
- 🛠 **Middleware for Automatic Logging**: Seamlessly log requests and responses.

## Installation

Install via npm:

```sh
npm install nestjs-logitron
```

or via yarn:

```sh
yarn add nestjs-logitron
```

## Usage

Initialize the logger service. You have two `LoggerType` options: `PINO` and `WINSTON`.

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService , } from 'nest-logitron';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(LoggerService))
  await app.listen(3000);
}

bootstrap().catch(console.error);
```

```typescript
//app.module.ts

import { Module } from '@nestjs/common';

import { LoggerType, LoggerModule, } from 'nest-logitron';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    LoggerModule.forRoot({
      type: LoggerType.PINO,
      options: {
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              options: {
                destination: 'app.log',
                singleLine: true,
                colorize: false,
                levelFirst: false,
                translateTime: 'dd-mm-yyyy hh:mm:ss TT',
              },
            },
            {
              target: 'pino-pretty',
              options: {
                singleLine: true,
                colorize: true,
                levelFirst: false,
                translateTime: 'dd-mm-yyyy hh:mm:ss TT',
              },
            },
          ],
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

Now you can inject the loggerService in any of service of nestjs as shown below:

```typescript
// app.controller.ts

import { Controller, Get, Logger,  } from '@nestjs/common';
import { AppService } from './app.service';
import {  TraceIdHandler } from 'nest-logitron';

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
```

### Execution Time Tracking

Use the `@LogExecutionTime` decorator to track method execution time.

```typescript
import { LogExecutionTime } from 'nestjs-logitron';
import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get()
  @LogExecutionTime()
  async fetchData() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { message: 'Hello, World!' };
  }
}
```

### Example output:

```bash
[2025-03-08T11:48:06] debug:[58a3f27d-23c4-406e-bef0-f06677c86a35]:{"traceId":"58a3f27d-23c4-406e-bef0-f06677c86a35"} AppController
[2025-03-08T11:48:07] error:[58a3f27d-23c4-406e-bef0-f06677c86a35]:Hello from AppService! AppService
[2025-03-08T11:48:10] info:[58a3f27d-23c4-406e-bef0-f06677c86a35]:[AppService.hello: 3012.000 ms] AppService
[2025-03-08T11:48:10] info:[58a3f27d-23c4-406e-bef0-f06677c86a35]:[AppService.getWorld: 3328.000 ms] AppService
[2025-03-08T11:48:10] info:[58a3f27d-23c4-406e-bef0-f06677c86a35]:{"method":"GET","url":"/","headers":{"host":"localhost:3000","connection":"keep-alive","sec-ch-ua":"\"Not(A:Brand\";v=\"99\", \"Microsoft Edge\";v=\"133\", \"Chromium\";v=\"133\"","sec-ch-ua-mobile":"?0","sec-ch-ua-platform":"\"Windows\"","upgrade-insecure-requests":"1","user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0","accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7","sec-fetch-site":"none","sec-fetch-mode":"navigate","sec-fetch-user":"?1","sec-fetch-dest":"document","accept-encoding":"gzip, deflate, br, zstd","accept-language":"en-US,en;q=0.9,en-IN;q=0.8","if-none-match":"W/\"4d-7Rd7ekovcKEvKZ5HFNBM2zS5gz4\""},"query":{},"responseTime":"3336.737 ms","statusCode":200} logitron


# [time] [level]: [traceId]:[methodName: execution time in ms]: message
```


## Contributing
If you have suggestions for improvements, bug reports, or other contributions, please feel free to open an issue or create a pull request.

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Added new feature"`
4. Push the branch: `git push origin feature-name`
5. Open a Pull Request.

## License

MIT License. Free to use and modify.

