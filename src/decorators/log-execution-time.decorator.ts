import speedCache from '../db';
import { LOGGER_OPTIONS } from '../constants';
import { LoggerType } from '../types';

export function LogExecutionTime(
  target: any,
  propertyKey?: string,
  descriptor?: PropertyDescriptor,
): any {
  const getLogger = () => {
    const options = speedCache.get(LOGGER_OPTIONS);

    return new LoggerService(
      options
    );
  };

  if (propertyKey && descriptor) {
    // Decorator for method
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const logger = getLogger();
      const start = performance.now();
      const result = originalMethod.apply(this, args);
      const end = performance.now();
      logger.info(`[${propertyKey}: ${Number(end - start)?.toFixed(3)} ms]`);
      return result;
    };
    return descriptor;
  } else {
    // Decorator for class
    const className = target.name;
    for (const key of Object.getOwnPropertyNames(target.prototype)) {
      const method = target.prototype[key];
      if (typeof method === 'function' && key !== 'constructor') {
        const originalMethod = method;
        target.prototype[key] = function (...args: any[]) {
          const logger = getLogger();
          const start = performance.now();
          const result = originalMethod.apply(this, args);
          const end = performance.now();
          logger.info(
            `[${className}.${key}: ${Number(end - start)?.toFixed(3)} ms]`,
          );
          return result;
        };
      }
    }
    return target;
  }
}