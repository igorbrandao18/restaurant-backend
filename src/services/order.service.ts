import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderDto } from '../dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(data: OrderDto) {
    const { items, ...rest } = data;
    return await this.prisma.order.create({
      data: {
        ...rest,
        items: items as any,
      },
    });
  }

  async getAllOrders() {
    return await this.prisma.order.findMany();
  }

  async getOrderById(id: number) {
    return await this.prisma.order.findUnique({
      where: { id }
    });
  }

  async updateOrder(id: number, data: OrderDto) {
    const { items, ...rest } = data;
    return await this.prisma.order.update({
      where: { id },
      data: {
        ...rest,
        items: items as any,
      },
    });
  }
} 