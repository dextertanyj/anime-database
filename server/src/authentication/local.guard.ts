import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Injectable()
export class LocalGuard extends AuthGuard("local") {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext<{ req: Request }>().req;
    const { input } = ctx.getArgs<{ input: { [key: string]: unknown } }>();
    request.body = { ...request.body, ...input } as Record<string, unknown>;
    return request;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { getResponse, getNext } = context.switchToHttp();
    context.switchToHttp = () => ({
      getRequest: <T>() => ({ ...request } as unknown as T),
      getResponse: getResponse,
      getNext: getNext,
    });
    const result = !!(await super.canActivate(context));
    await super.logIn(request);
    return result;
  }
}
