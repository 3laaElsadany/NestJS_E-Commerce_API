import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizeRoles } from '../decorators/authorize-roles.decorator';


@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const authorizeRoles = this.reflector.get<string[]>(AuthorizeRoles, context.getHandler());
    if (!authorizeRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request['currentUser'];
    if (authorizeRoles.includes(user.role)) {
      return true;
    } else {
      throw new UnauthorizedException('You are not authorized.');
    }
  }
}
