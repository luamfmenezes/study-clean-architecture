export interface Encrypt {
  encrypt(value: string): Promise<string>;
}
