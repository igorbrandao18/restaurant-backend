import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../../../src/controllers/order.controller';
import { OrderService } from '../../../src/services/order.service';
import { OrderDto, OrderStatus, OrderItemDto } from '../../../src/dto/order.dto';
import { Prisma } from '@prisma/client';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockRequest = {
    user: {
      restaurantId: 1,
      id: 1
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn(),
            getAllOrders: jest.fn(),
            updateOrder: jest.fn(),
            getOrderById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an order', async () => {
      const orderItems = [
        { menuItemId: 1, quantity: 2 }
      ];

      const orderDto: OrderDto = {
        restaurantId: 1,
        customerId: 1,
        items: { items: orderItems } as any,
        total: 29.99,
        status: OrderStatus.PENDING
      };

      const expectedResult = {
        id: 1,
        restaurantId: 1,
        customerId: 1,
        items: { items: orderItems } as Prisma.JsonValue,
        total: 29.99,
        status: OrderStatus.PENDING
      };

      jest.spyOn(service, 'createOrder').mockResolvedValue(expectedResult);

      const result = await controller.create(mockRequest, orderDto);
      expect(result).toEqual({ status: 201, order: expectedResult });
    });

    it('should throw UnauthorizedException when creating order without authentication', async () => {
      const orderDto: OrderDto = {
        restaurantId: 1,
        customerId: 1,
        items: { items: [] } as any,
        total: 0,
        status: OrderStatus.PENDING
      };

      await expect(controller.create({ user: null }, orderDto))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getAll', () => {
    it('should return an array of orders for authenticated restaurant', async () => {
      const expectedResult = [
        {
          id: 1,
          restaurantId: 1,
          customerId: 1,
          items: {
            items: [
              { menuItemId: 1, quantity: 2 }
            ]
          } as Prisma.JsonValue,
          total: 29.99,
          status: OrderStatus.PENDING
        },
        {
          id: 2,
          restaurantId: 2,
          customerId: 2,
          items: {
            items: [
              { menuItemId: 2, quantity: 1 }
            ]
          } as Prisma.JsonValue,
          total: 19.99,
          status: OrderStatus.COMPLETED
        }
      ];

      jest.spyOn(service, 'getAllOrders').mockResolvedValue(expectedResult);

      const result = await controller.getAll(mockRequest);
      expect(result).toEqual({ 
        status: 200, 
        orders: expectedResult.filter(order => order.restaurantId === mockRequest.user.restaurantId) 
      });
    });

    it('should throw UnauthorizedException when getting orders without authentication', async () => {
      await expect(controller.getAll({ user: null }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const id = '1';
      const orderItems = [
        { menuItemId: 1, quantity: 3 }
      ];

      const updateDto: OrderDto = {
        restaurantId: 1,
        customerId: 1,
        items: { items: orderItems } as any,
        total: 39.99,
        status: OrderStatus.COMPLETED
      };

      const existingOrder = {
        id: 1,
        restaurantId: 1,
        customerId: 1,
        items: { items: orderItems } as Prisma.JsonValue,
        total: 39.99,
        status: OrderStatus.PENDING
      };

      const expectedResult = {
        ...existingOrder,
        status: OrderStatus.COMPLETED
      };

      jest.spyOn(service, 'getOrderById').mockResolvedValue(existingOrder);
      jest.spyOn(service, 'updateOrder').mockResolvedValue(expectedResult);

      const result = await controller.update(mockRequest, id, updateDto);
      expect(result).toEqual({ status: 200, order: expectedResult });
    });

    it('should throw UnauthorizedException when updating order without authentication', async () => {
      const id = '1';
      const updateDto: OrderDto = {
        restaurantId: 1,
        customerId: 1,
        items: { items: [] } as any,
        total: 0,
        status: OrderStatus.COMPLETED
      };

      await expect(controller.update({ user: null }, id, updateDto))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException when updating order from another restaurant', async () => {
      const id = '1';
      const orderItems = [
        { menuItemId: 1, quantity: 3 }
      ];

      const updateDto: OrderDto = {
        restaurantId: 2,
        customerId: 1,
        items: { items: orderItems } as any,
        total: 39.99,
        status: OrderStatus.COMPLETED
      };

      const existingOrder = {
        id: 1,
        restaurantId: 2,
        customerId: 1,
        items: { items: orderItems } as Prisma.JsonValue,
        total: 39.99,
        status: OrderStatus.PENDING
      };

      jest.spyOn(service, 'getOrderById').mockResolvedValue(existingOrder);

      await expect(controller.update(mockRequest, id, updateDto))
        .rejects.toThrow(ForbiddenException);
    });
  });
}); 