import { Reflector } from '@nestjs/core';

export const AuthorizeRoles = Reflector.createDecorator<string[]>();
