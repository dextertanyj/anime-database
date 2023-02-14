import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class SessionGuard implements CanActivate {
  getRequest(context: ExecutionContext) {
    return GqlExecutionContext.create(context).getContext().req;
  }

  canActivate(context: ExecutionContext): boolean {
    const isAuthenticated = this.getRequest(context).isAuthenticated();
    if (!isAuthenticated) {
      // Return 401 instead of 403 status
      throw new UnauthorizedException();
    }
    return true;
  }
}
