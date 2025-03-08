export interface IDatabase<K extends IDBKeyType, T> {
    get(id: K): T | undefined;
    set(id: K, value: T, expiry: number): void;
    del(id: K): void;
  }
  
  export type IDBKeyType = string | number | symbol;