import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from '../services/order.service';
import { OrderDto } from '../dto/order.dto';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
    }).compile();

    orderController = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should create an order', async () => {
    const orderData: OrderDto = {
      restaurantId: 1,
      customerId: 1,
      items: { items: [{ id: 1, quantity: 2 }] },
      total: 29.99
    };
    jest.spyOn(orderService, 'createOrder').mockResolvedValue({ id: 1, ...orderData });
    const result = await orderController.create(orderData);
    expect(result).toEqual({ status: 201, order: { id: 1, ...orderData } });
  });

  it('should get all orders', async () => {
    jest.spyOn(orderService, 'getAllOrders').mockResolvedValue([]);
    const result = await orderController.getAll();
    expect(result).toEqual({ status: 200, orders: [] });
  });

  it('should update an order', async () => {
    const orderData: OrderDto = {
      restaurantId: 1,
      customerId: 1,
      items: { items: [{ id: 1, quantity: 2 }] },
      total: 39.99
    };
    jest.spyOn(orderService, 'updateOrder').mockResolvedValue({ id: 1, ...orderData });
    const result = await orderController.update('1', orderData);
    expect(result).toEqual({ status: 200, updatedOrder: { id: 1, ...orderData } });
  });
}); 