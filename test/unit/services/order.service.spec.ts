import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../../../src/services/order.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { OrderStatus } from '../../../src/dto/order.dto';

describe('OrderService', () => {
  let service: OrderService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: PrismaService,
          useValue: {
            order: {
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create an order', async () => {
      const orderData = {
        restaurantId: 1,
        customerId: 1,
        items: { items: [{ menuItemId: 1, quantity: 2 }] },
        total: 29.99,
        status: OrderStatus.PENDING
      };

      const mockOrder = {
        id: 1,
        ...orderData
      };

      jest.spyOn(prismaService.order, 'create').mockResolvedValue(mockOrder);

      const result = await service.createOrder(orderData);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('getAllOrders', () => {
    it('should return an array of orders', async () => {
      const mockOrders = [
        {
          id: 1,
          restaurantId: 1,
          customerId: 1,
          items: { items: [{ menuItemId: 1, quantity: 2 }] },
          total: 29.99,
          status: OrderStatus.PENDING
        },
        {
          id: 2,
          restaurantId: 1,
          customerId: 2,
          items: { items: [{ menuItemId: 2, quantity: 1 }] },
          total: 19.99,
          status: OrderStatus.PREPARING
        }
      ];

      jest.spyOn(prismaService.order, 'findMany').mockResolvedValue(mockOrders);

      const result = await service.getAllOrders();
      expect(result).toEqual(mockOrders);
    });
  });

  describe('updateOrder', () => {
    it('should update an order', async () => {
      const id = 1;
      const updateData = {
        restaurantId: 1,
        customerId: 1,
        items: { items: [{ menuItemId: 1, quantity: 3 }] },
        total: 39.99,
        status: OrderStatus.COMPLETED
      };

      const mockUpdatedOrder = {
        id,
        ...updateData
      };

      jest.spyOn(prismaService.order, 'update').mockResolvedValue(mockUpdatedOrder);

      const result = await service.updateOrder(id, updateData);
      expect(result).toEqual(mockUpdatedOrder);
    });
  });
}); 