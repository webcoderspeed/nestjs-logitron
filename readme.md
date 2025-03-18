# NestJS Logitron

A **lightweight**, **high-performance** logging utility for NestJS applications, built on **Pino** and **Winston**, with **execution time tracking**, **request tracing**, and **Kafka trace interception**.

## 🚀 Features

- **Execution Time Tracking**: Measure and log the execution time of controllers and methods automatically.
- **Request Logging Middleware**: Capture incoming HTTP requests, including metadata like headers, query params, and response time.
- **Trace Middleware**: Ensure every request has a unique trace ID for better debugging and correlation.
- **Logger Factory**: Easily create custom loggers with flexible configurations.
- **Multiple Logger Support**: Choose between `Pino` (lightweight, high-performance) and `Winston` (multi-transport support) based on your needs.
- **Automatic Logging Middleware**: Log both incoming requests and outgoing responses effortlessly.
- **Kafka Trace Interceptor**: Automatically attach trace IDs to Kafka messages, ensuring full traceability across distributed services.

---

## Installation

Install via npm:

```sh
npm install nestjs-logitron
```

or via yarn:

```sh
yarn add nestjs-logitron
```

---

## 🛠️ Usage

### Setting Up the Logger in `main.ts`

You can initialize the logger with either `PINO` or `WINSTON` as the logging backend.

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from 'nestjs-logitron';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(LoggerService));
  await app.listen(3000);
}

bootstrap().catch(console.error);
```

### Configuring the Logger in `app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { LoggerType, LoggerModule } from 'nestjs-logitron';
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
                destination: 'api.log',
                singleLine: true,
                colorize: false,
                translateTime: 'yyyy-mm-dd HH:MM:ss',
              },
            },
            {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss',
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

### Using Logger in a Controller

```typescript
import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { TraceIdHandler } from 'nestjs-logitron';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @Get()
  async getHello() {
    this.logger.debug({ traceId: TraceIdHandler.getTraceId() });
    return this.appService.getWorld();
  }
}
```

---

## 🔍 Why We Use `async_hooks` for Trace ID Storage

### The Problem:
Handling trace IDs in **asynchronous** environments (like HTTP requests, DB queries, and background tasks) is difficult because global variables **do not** retain execution context.

### The Solution:
Node.js `async_hooks` enables **continuation-local storage (CLS)**, ensuring that each trace ID is bound to its originating request, even in async operations.

### How It Works:
- A **new async context** is created per request.
- The trace ID is stored in this context and is **automatically retained** across async calls.
- No manual propagation is needed—**every log within the request cycle contains the trace ID**.

### Express Middleware for Trace Injection

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { TraceIdHandler, withTraceId } from 'nestjs-logitron';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    const traceId = req.headers['x-trace-id'] || uuidv4();
    withTraceId(traceId, () => next());
  }
}
```

---

## 🛠️ Kafka Trace Interceptor

### **Why Do We Need This?**

In **microservices architectures**, messages pass through **Kafka**, but they lose their original HTTP request trace IDs. This makes debugging **very difficult**.

### **How It Works:**
- Extracts `traceId` from Kafka messages (if present) or generates a new one.
- Stores `traceId` using `async_hooks`.
- Ensures **all logs from Kafka handlers** contain the correct `traceId`.

### **Implementation**

```typescript
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { TraceIdHandler, withTraceId } from 'nestjs-logitron';

@Injectable()
export class KafkaTraceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const payload = context.switchToRpc().getData();
    const traceId = payload?.traceId ?? uuidv4();
    
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
```

---

## 📜 Log Output Format

```
[yyyy-mm-dd HH:MM:ss.MS] [log_level] [app_name] [trace_id] [message] [payload] [time_taken_MS]
```

**Example:**
```bash
[2025-03-18T06:30:20.156Z] [ERROR] [NESTJS-LOGITRON] [12345-trace-id] [Something went wrong] [N/A] [N/A]
```

---

## 🤝 Contribution

We welcome contributions from the community! 🚀

### Steps to Contribute:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Added new feature"`.
4. Push the branch: `git push origin feature-name`.
5. Open a Pull Request.

---

## 📜 License

`nestjs-logitron` is licensed under the **MIT License**.

---

## 📞 Contact & Support

Have questions? Found an issue? Open an issue on GitHub or reach out!

Happy logging! 📜✨

