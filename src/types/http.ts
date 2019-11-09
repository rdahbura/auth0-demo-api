import { STATUS_CODES } from 'http';

export class HttpError extends Error {
  statusCode: number;
  errors: object[] | undefined;

  constructor(statusCode: number, message?: string, errors?: object[]) {
    super(message || STATUS_CODES[statusCode] || statusCode.toString());
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export class Token {
  type: string;
  value: string;
  private _expiresAt: number;
  private _expiresIn: number;

  constructor() {
    this.type = '';
    this.value = '';
    this._expiresAt = 0;
    this._expiresIn = 0;
  }

  get expiresIn(): number {
    return this._expiresIn;
  }

  set expiresIn(expiresIn: number) {
    this._expiresAt = Date.now() + expiresIn;
    this._expiresIn = expiresIn;
  }

  isValid = (): boolean => Date.now() < this._expiresAt;
}
