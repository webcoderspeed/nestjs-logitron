import { IDatabase, IDBKeyType } from "../types";

/**
 * A simple cache implementation using Map for storing key-value pairs.
 * Provides methods for getting, setting, and deleting values with optional expiry.
 */
export class SpeedCache<K extends IDBKeyType, T> implements IDatabase<K, T> {
  private db: Map<K, T> = new Map();

  /**
   * Retrieves the value associated with the given key from the cache.
   * @param key Key of the record to retrieve.
   * @returns The value associated with the given key, or undefined if the key doesn't exist.
   */
  get(key: K): T | undefined {
    return this.db.get(key);
  }

  /**
   * Sets the value associated with the given key in the cache.
   * Optionally accepts an expiry time in seconds.
   * @param key Key of the record.
   * @param value Value of the record.
   * @param expiry Expiry time in seconds (optional, defaults to 0 which means no expiry).
   */
  set(key: K, value: T, expiry: number = 0): void {
    this.db.set(key, value);

    // If expiry is specified, schedule deletion after expiry time.
    if (expiry !== 0) {
      setTimeout(() => {
        this.del(key); // Call del synchronously after expiry.
      }, expiry * 1000);
    }
  }

  /**
   * Deletes the record associated with the given key from the cache.
   * @param key Key of the record to delete.
   */
  del(key: K): void {
    this.db.delete(key);
  }
}

const speedCache = new SpeedCache();

export default speedCache;