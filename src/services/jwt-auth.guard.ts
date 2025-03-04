import { Injectable, ExecutionContext, UnauthorizedException, CanActivate } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { User } from '../types/user';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('No token provided');
      }

      const token = authHeader.split(' ')[1];

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { id: number; username: string };
        request.user = {
          id: decoded.id,
          username: decoded.username,
          restaurantId: decoded.id
        };
        return true;
      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          throw new UnauthorizedException('Invalid token');
        }
        if (error instanceof jwt.TokenExpiredError) {
          throw new UnauthorizedException('Token expired');
        }
        throw new UnauthorizedException('Invalid token');
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }
} 