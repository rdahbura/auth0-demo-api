export class HttpError {
  statusCode: number;
  message: string;
  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

export class HttpValidationError extends HttpError {
  errors: object[];
  constructor(statusCode: number, message: string, errors?: object[]) {
    super(statusCode, message);
    this.errors = errors || [];
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
