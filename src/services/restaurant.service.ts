import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RestaurantDto } from '../dto/restaurant.dto';
import { AuthService } from './auth.service';

@Injectable()
export class RestaurantService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService
  ) {}

  async createRestaurant(data: RestaurantDto) {
    const hashedPassword = await this.authService.hashPassword(data.password);
    return await this.prisma.restaurant.create({
      data: {
        ...data,
        password: hashedPassword
      }
    });
  }

  async getAllRestaurants() {
    return await this.prisma.restaurant.findMany();
  }

  async updateRestaurant(id: number, data: RestaurantDto) {
    if (data.password) {
      data.password = await this.authService.hashPassword(data.password);
    }
    return await this.prisma.restaurant.update({
      where: { id },
      data,
    });
  }

  async getRestaurantById(id: number) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id }
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }

  async getRestaurantMenus(restaurantId: number) {
    const menus = await this.prisma.menu.findMany({
      where: { restaurantId }
    });

    return menus;
  }
}
