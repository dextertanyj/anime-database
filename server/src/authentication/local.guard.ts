import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalGuard extends AuthGuard("local") {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const { input } = ctx.getArgs();
    request.body = { ...request.body, ...input };
    return request;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const { getResponse, getNext } = context.switchToHttp();
    context.switchToHttp = () => ({
      getRequest: () => ({
        ...request,
      }),
      getResponse: getResponse,
      getNext: getNext,
    });
    const result = (await super.canActivate(context)) as boolean;
    await super.logIn(request);
    return result;
  }
}
