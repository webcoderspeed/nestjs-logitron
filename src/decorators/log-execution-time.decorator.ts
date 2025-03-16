import { Logger } from "@nestjs/common";

export function LogExecutionTime(): ClassDecorator {
  return function (target: Function) {
    const logger = new Logger(target.name);

    for (const key of Object.getOwnPropertyNames(target.prototype)) {
      const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);

      if (!descriptor || typeof descriptor.value !== 'function' || key === 'constructor') {
        continue;
      }

      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: any[]) {
        const start = Date.now();
        try {
          const result = await originalMethod.apply(this, args);
          return result;
        } finally {
          const executionTime = Date.now() - start;
          logger.log(
            `${target.name}.${key}: ${Number(executionTime)?.toFixed(3)} ms`,
          );
        }
      };

      Object.defineProperty(target.prototype, key, descriptor);
    }
  };
}
