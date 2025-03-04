import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RestaurantDto } from '../dto/restaurant.dto';

const prisma = new PrismaClient();

@Injectable()
export class RestaurantService {
  async createRestaurant(data: RestaurantDto) {
    return await prisma.restaurant.create({ data });
  }

  async getAllRestaurants() {
    return await prisma.restaurant.findMany();
  }

  async updateRestaurant(id: number, data: RestaurantDto) {
    return await prisma.restaurant.update({
      where: { id },
      data,
    });
  }
}
