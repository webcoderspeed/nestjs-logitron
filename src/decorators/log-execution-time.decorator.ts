import { Logger } from "@nestjs/common";

export function TrackExecutionTime(): ClassDecorator {
  return function (target: Function) {
    const logger = new Logger(target.name);

    // Iterate over all properties of the prototype (methods)
    for (const key of Object.getOwnPropertyNames(target.prototype)) {
      const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);

      // Ensure it's a function and not the constructor
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
            `[${target.name}.${key}: ${Number(executionTime)?.toFixed(3)} ms]`,
          );
        }
      };

      Object.defineProperty(target.prototype, key, descriptor);
    }
  };
}
