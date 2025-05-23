import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isArray } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer')) {
      req["currentUser"] = null;
    } else {
      try {
        const token = authHeader.split(' ')[1];
        const { id } = await this.jwtService.verify(token)
        req["currentUser"] = await this.usersService.findOne(id)
      } catch (error) {
        req["currentUser"] = null;
      }
    }
    next();
  }
}