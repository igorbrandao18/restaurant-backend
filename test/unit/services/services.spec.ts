import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from '../../../src/services/restaurant.service';
import { MenuService } from '../../../src/services/menu.service';
import { OrderService } from '../../../src/services/order.service';
import { AuthService } from '../../../src/services/auth.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { RestaurantDto } from '../../../src/dto/restaurant.dto';
import { MenuDto } from '../../../src/dto/menu.dto';
import { OrderDto, OrderStatus } from '../../../src/dto/order.dto';
import { Prisma } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';

describe('Service Unit Tests', () => {
  let restaurantService: RestaurantService;
  let menuService: MenuService;
  let orderService: OrderService;
  let authService: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
        MenuService,
        OrderService,
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            restaurant: {
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              findUnique: jest.fn(),
            },
            menu: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
            order: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    restaurantService = module.get<RestaurantService>(RestaurantService);
    menuService = module.get<MenuService>(MenuService);
    orderService = module.get<OrderService>(OrderService);
    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('RestaurantService', () => {
    it('should create a restaurant', async () => {
      const restaurantDto: RestaurantDto = {
        name: 'Test Restaurant',
        address: '123 Test St',
        city: 'Test City',
        country: 'Test Country',
        username: `testrestaurant_${Date.now()}`,
        password: 'testpassword',
        webSettings: {}
      };

      const mockRestaurant = {
        id: 1,
        ...restaurantDto,
        password: '$argon2id$v=19$m=65536,t=3,p=1$c29tZXNhbHQ$c29tZWhhc2g'
      };

      jest.spyOn(prismaService.restaurant, 'create').mockResolvedValue(mockRestaurant);
      jest.spyOn(authService, 'hashPassword').mockResolvedValue('$argon2id$v=19$m=65536,t=3,p=1$c29tZXNhbHQ$c29tZWhhc2g');

      const result = await restaurantService.createRestaurant(restaurantDto);
      expect(result).toEqual(mockRestaurant);
    });

    it('should update a restaurant', async () => {
      const id = 1;
      const updateDto: RestaurantDto = {
        name: 'Updated Restaurant',
        address: '456 Update St',
        city: 'Update City',
        country: 'Update Country',
        username: `updatedrestaurant_${Date.now()}`,
        password: 'updatedpassword',
        webSettings: {}
      };

      const mockUpdatedRestaurant = {
        id,
        ...updateDto,
        password: '$argon2id$v=19$m=65536,t=3,p=1$c29tZXNhbHQ$c29tZWhhc2g'
      };

      jest.spyOn(prismaService.restaurant, 'update').mockResolvedValue(mockUpdatedRestaurant);
      jest.spyOn(authService, 'hashPassword').mockResolvedValue('$argon2id$v=19$m=65536,t=3,p=1$c29tZXNhbHQ$c29tZWhhc2g');

      const result = await restaurantService.updateRestaurant(id, updateDto);
      expect(result).toEqual(mockUpdatedRestaurant);
    });
  });

  describe('MenuService', () => {
    it('should create a menu', async () => {
      const menuDto: MenuDto = {
        name: 'Test Menu',
        type: 'MENU',
        collapse: 0,
        restaurantId: 1,
        sections: {
          sections: [
            {
              id: 1,
              name: 'Test Section',
              description: 'Test Section Description',
              position: 0,
              visible: 1,
              images: [
                {
                  id: 1,
                  image: 'https://example.com/image.jpg',
                },
              ],
              items: [
                {
                  id: 1,
                  name: 'Test Item',
                  description: 'Test Description',
                  alcoholic: 0,
                  price: 10.00,
                  position: 0,
                  visible: 1,
                  availabilityType: 'AVAILABLE_NOW',
                  sku: 'TEST123',
                  images: [],
                  modifiers: [],
                  available: true,
                },
              ],
            },
          ],
        },
      };

      const mockMenu = {
        id: 1,
        ...menuDto
      };

      jest.spyOn(prismaService.menu, 'create').mockResolvedValue(mockMenu);
      const result = await menuService.createMenu(menuDto);
      expect(result).toEqual(mockMenu);
    });

    it('should get all menus for a restaurant', async () => {
      const restaurantDto: RestaurantDto = {
        name: 'Test Restaurant',
        address: '123 Test St',
        city: 'Test City',
        country: 'Test Country',
        username: `menulistrestaurant_${Date.now()}`,
        password: 'testpassword',
        webSettings: {}
      };

      const mockRestaurant = {
        id: 1,
        ...restaurantDto,
        password: '$argon2id$v=19$m=65536,t=3,p=1$c29tZXNhbHQ$c29tZWhhc2g'
      };

      const mockMenus = [
        {
          id: 1,
          name: 'Menu 1',
          type: 'MENU',
          collapse: 0,
          restaurantId: mockRestaurant.id,
          sections: {
            sections: [
              {
                id: 1,
                name: 'Section 1',
                position: 0,
                visible: 1,
                items: []
              }
            ]
          }
        },
        {
          id: 2,
          name: 'Menu 2',
          type: 'MENU',
          collapse: 0,
          restaurantId: mockRestaurant.id,
          sections: {
            sections: [
              {
                id: 2,
                name: 'Section 2',
                position: 0,
                visible: 1,
                items: []
              }
            ]
          }
        }
      ];

      jest.spyOn(prismaService.restaurant, 'create').mockResolvedValue(mockRestaurant);
      jest.spyOn(prismaService.menu, 'findMany').mockResolvedValue(mockMenus);
      jest.spyOn(authService, 'hashPassword').mockResolvedValue('$argon2id$v=19$m=65536,t=3,p=1$c29tZXNhbHQ$c29tZWhhc2g');

      await restaurantService.createRestaurant(restaurantDto);
      const result = await menuService.getAllMenus();
      expect(result).toEqual(mockMenus);
    });
  });

  describe('OrderService', () => {
    it('should create an order', async () => {
      const orderDto: OrderDto = {
        restaurantId: 1,
        customerId: 1,
        items: {
          items: [
            {
              menuItemId: 1,
              quantity: 2
            }
          ]
        },
        total: 19.98,
        status: OrderStatus.PENDING
      };

      const mockOrder = {
        id: 1,
        restaurantId: orderDto.restaurantId,
        customerId: orderDto.customerId,
        items: JSON.parse(JSON.stringify(orderDto.items)) as Prisma.JsonValue,
        total: orderDto.total,
        status: orderDto.status
      };

      jest.spyOn(prismaService.order, 'create').mockResolvedValue(mockOrder);
      const result = await orderService.createOrder(orderDto);
      expect(result).toEqual(mockOrder);
    });

    it('should get all orders for a restaurant', async () => {
      const restaurantDto: RestaurantDto = {
        name: 'Test Restaurant',
        address: '123 Test St',
        city: 'Test City',
        country: 'Test Country',
        username: `orderlistrestaurant_${Date.now()}`,
        password: 'testpassword',
        webSettings: {}
      };

      const mockRestaurant = {
        id: 1,
        ...restaurantDto,
        password: '$argon2id$v=19$m=65536,t=3,p=1$c29tZXNhbHQ$c29tZWhhc2g'
      };

      const mockOrders = [
        {
          id: 1,
          restaurantId: 1,
          customerId: 1,
          items: JSON.parse(JSON.stringify({ 
            items: [
              { menuItemId: 1, quantity: 2 }
            ]
          })) as Prisma.JsonValue,
          total: 19.98,
          status: OrderStatus.PENDING
        },
        {
          id: 2,
          restaurantId: 1,
          customerId: 2,
          items: JSON.parse(JSON.stringify({
            items: [
              { menuItemId: 2, quantity: 1 }
            ]
          })) as Prisma.JsonValue,
          total: 14.99,
          status: OrderStatus.COMPLETED
        }
      ];

      jest.spyOn(prismaService.restaurant, 'create').mockResolvedValue(mockRestaurant);
      jest.spyOn(prismaService.order, 'findMany').mockResolvedValue(mockOrders);
      jest.spyOn(authService, 'hashPassword').mockResolvedValue('$argon2id$v=19$m=65536,t=3,p=1$c29tZXNhbHQ$c29tZWhhc2g');

      await restaurantService.createRestaurant(restaurantDto);
      const result = await orderService.getAllOrders();
      expect(result).toEqual(mockOrders);
    });
  });

  describe('AuthService', () => {
    it('should authenticate a restaurant with valid credentials', async () => {
      const username = 'testuser';
      const password = 'testpass';
      const hashedPassword = await authService.hashPassword(password);

      const mockRestaurant = {
        id: 1,
        username,
        password: hashedPassword,
        name: 'Test Restaurant',
        address: '123 Test St',
        city: 'Test City',
        country: 'Test Country',
        webSettings: {}
      };

      jest.spyOn(prismaService.restaurant, 'findUnique').mockResolvedValue(mockRestaurant);
      
      const result = await authService.login({ username, password });
      expect(result).toHaveProperty('token');
    });

    it('should throw UnauthorizedException for non-existent restaurant', async () => {
      jest.spyOn(prismaService.restaurant, 'findUnique').mockResolvedValue(null);

      await expect(authService.login({
        username: 'nonexistent',
        password: 'wrongpass'
      })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const username = 'testuser';
      const correctPassword = 'correctpass';
      const wrongPassword = 'wrongpass';
      const hashedPassword = await authService.hashPassword(correctPassword);

      const mockRestaurant = {
        id: 1,
        username,
        password: hashedPassword,
        name: 'Test Restaurant',
        address: '123 Test St',
        city: 'Test City',
        country: 'Test Country',
        webSettings: {}
      };

      jest.spyOn(prismaService.restaurant, 'findUnique').mockResolvedValue(mockRestaurant);

      await expect(authService.login({
        username,
        password: wrongPassword
      })).rejects.toThrow(UnauthorizedException);
    });
  });
}); 