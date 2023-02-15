import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request as ExpressRequest } from "express";

export const Request = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  return GqlExecutionContext.create(ctx).getContext<{ req: ExpressRequest }>().req;
});
