declare module 'argon2' {
  export const argon2id: number;
  
  export interface Options {
    type?: number;
    memoryCost?: number;
    timeCost?: number;
    parallelism?: number;
  }

  export function hash(plain: string, options?: Options): Promise<string>;
  export function verify(hash: string, plain: string): Promise<boolean>;
} 