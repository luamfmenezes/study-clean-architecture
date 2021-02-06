export interface LogRepository {
  logError(stack: string): Promise<void>;
}
