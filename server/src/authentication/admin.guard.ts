import assert from "assert";

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";

import { Constants } from "src/common/constants/constants";

@Injectable()
export class AdminGuard implements CanActivate {
  getRequest(context: ExecutionContext) {
    return GqlExecutionContext.create(context).getContext<{ req: Request }>().req;
  }

  canActivate(context: ExecutionContext): boolean {
    const isAuthenticated = this.getRequest(context).isAuthenticated();
    if (!isAuthenticated) {
      // Return 401 instead of 403 status
      throw new UnauthorizedException();
    }
    const user = this.getRequest(context).user;
    assert(user);
    if (!Constants.AdminRoles.includes(user.role)) {
      return false;
    }
    return true;
  }
}
