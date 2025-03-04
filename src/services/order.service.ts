import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { OrderDto } from '../dto/order.dto';

const prisma = new PrismaClient();

@Injectable()
export class OrderService {
  async createOrder(data: OrderDto) {
    return await prisma.order.create({ data });
  }

  async getAllOrders() {
    return await prisma.order.findMany();
  }

  async updateOrder(id: number, data: OrderDto) {
    return await prisma.order.update({
      where: { id },
      data,
    });
  }
} 