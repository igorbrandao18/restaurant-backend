import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { OrderDto } from '../dto/order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() orderData: OrderDto) {
    const order = await this.orderService.createOrder(orderData);
    return { status: 201, order };
  }

  @Get()
  async getAll() {
    const orders = await this.orderService.getAllOrders();
    return { status: 200, orders };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() orderData: OrderDto) {
    const updatedOrder = await this.orderService.updateOrder(+id, orderData);
    return { status: 200, updatedOrder };
  }
} 