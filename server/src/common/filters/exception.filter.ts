import { ArgumentsHost, Catch } from "@nestjs/common";
import { GqlExceptionFilter } from "@nestjs/graphql";

import { BaseError } from "src/common/errors/base.error";

@Catch(BaseError)
export class ExceptionFilter implements GqlExceptionFilter {
  catch(exception: BaseError, _: ArgumentsHost) {
    return exception.getHttpException();
  }
}
