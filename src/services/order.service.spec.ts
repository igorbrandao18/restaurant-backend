import { OrderService } from './order.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const orderService = new OrderService();

describe('OrderService', () => {
  it('should create an order', async () => {
    const orderData = {
      restaurantId: 1,
      customerId: 1,
      items: { items: [{ id: 1, quantity: 2 }] },
      total: 29.99
    };
    const order = await orderService.createOrder(orderData);
    expect(order).toHaveProperty('id');
  });

  it('should get all orders', async () => {
    const orders = await orderService.getAllOrders();
    expect(Array.isArray(orders)).toBe(true);
  });

  it('should update an order', async () => {
    const orderData = {
      restaurantId: 1,
      customerId: 1,
      items: { items: [{ id: 1, quantity: 2 }] },
      total: 29.99
    };
    const order = await orderService.createOrder(orderData);
    const updatedOrder = await orderService.updateOrder(order.id, {
      ...orderData,
      total: 39.99
    });
    expect(updatedOrder.total).toBe(39.99);
  });
}); 