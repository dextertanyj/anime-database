import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const User = createParamDecorator(
	(_: unknown, ctx: ExecutionContext) => {
		return GqlExecutionContext.create(ctx).getContext().req.user;
	},
);
