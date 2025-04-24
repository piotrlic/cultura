export class CardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CardError';
  }
}

export class CardCreationError extends CardError {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'CardCreationError';
  }
}

export class CardValidationError extends CardError {
  constructor(message: string, public readonly errors: unknown[]) {
    super(message);
    this.name = 'CardValidationError';
  }
}

export class DatabaseError extends CardError {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'DatabaseError';
  }
} 