import { logger } from './logger';

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === 'string') return maybeMessage;
  }
  return 'Something went wrong. Please try again.';
}

export function reportError(scope: string, error: unknown): void {
  logger.error(`${scope}: ${getErrorMessage(error)}`, error);
}
