/**
 * Logger utility for consistent logging across the application
 */
export class Logger {
  constructor(private context: string) {}

  info(message: string, meta?: Record<string, unknown>) {
    console.log(`[${this.context}] ${message}`, meta || "");
  }

  error(message: string, error?: unknown) {
    console.error(`[${this.context}] ${message}`, error || "");
  }

  warn(message: string, meta?: Record<string, unknown>) {
    console.warn(`[${this.context}] ${message}`, meta || "");
  }

  debug(message: string, meta?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[${this.context}] ${message}`, meta || "");
    }
  }
}

export const createLogger = (context: string) => new Logger(context);
