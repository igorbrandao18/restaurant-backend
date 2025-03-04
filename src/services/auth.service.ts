import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthDto } from '../dto/auth.dto';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  async login(data: AuthDto) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { username: data.username },
    });
    if (restaurant && restaurant.password === data.password) {
      const token = jwt.sign({ id: restaurant.id }, 'your_jwt_secret');
      return token;
    }
    throw new Error('Invalid credentials');
  }
} 