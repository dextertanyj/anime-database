import { HttpException, NotFoundException } from "@nestjs/common";

import { BaseError } from "./base.error";

export class EntityNotFoundError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = "EntityNotFound";
  }

  getHttpException(): HttpException {
    return new NotFoundException(this.message);
  }
}
