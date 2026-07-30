/**
 * Base de todas las excepciones del framework.
 */
export abstract class CoreException extends Error {
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, code: string, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationException extends CoreException {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
  }
}

export class UnauthorizedException extends CoreException {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED');
  }
}

export class NotFoundException extends CoreException {
  constructor(message: string) {
    super(message, 'NOT_FOUND');
  }
}

export class InternalSystemException extends CoreException {
  constructor(message: string) {
    super(message, 'INTERNAL_ERROR', false);
  }
}
