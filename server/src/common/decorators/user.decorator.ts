import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";

export const User = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  return GqlExecutionContext.create(ctx).getContext<{ req: Request }>().req.user;
});
