import { ConflictException, HttpException } from "@nestjs/common";

import { BaseError } from "./base.error";

export class UniqueConstraintViolationError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = "UniqueConstraintViolation";
  }

  getHttpException(): HttpException {
    return new ConflictException(this.message);
  }
}
