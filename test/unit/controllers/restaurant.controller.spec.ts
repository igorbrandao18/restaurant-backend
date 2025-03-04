import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantController } from '../../../src/controllers/restaurant.controller';
import { RestaurantService } from '../../../src/services/restaurant.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { AuthService } from '../../../src/services/auth.service';
import { RestaurantDto } from '../../../src/dto/restaurant.dto';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../../src/types/user';

describe('RestaurantController', () => {
  let controller: RestaurantController;
  let service: RestaurantService;

  const mockUser: User = {
    id: 1,
    username: 'testrest',
    restaurantId: 1
  };

  const mockRequest = {
    user: mockUser,
    get: jest.fn(),
    header: jest.fn(),
    accepts: jest.fn(),
    acceptsCharsets: jest.fn(),
    acceptsEncodings: jest.fn(),
    acceptsLanguages: jest.fn(),
    range: jest.fn(),
  } as unknown as Request;

  const mockRequestNoAuth = {
    user: undefined,
    get: jest.fn(),
    header: jest.fn(),
    accepts: jest.fn(),
    acceptsCharsets: jest.fn(),
    acceptsEncodings: jest.fn(),
    acceptsLanguages: jest.fn(),
    range: jest.fn(),
  } as unknown as Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [
        RestaurantService,
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
          },
        },
      ],
    }).compile();

    controller = module.get<RestaurantController>(RestaurantController);
    service = module.get<RestaurantService>(RestaurantService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a restaurant', async () => {
      const restaurantDto: RestaurantDto = {
        name: 'Test Restaurant',
        username: 'testrest',
        password: 'testpass',
        address: '123 Test St',
        city: 'Test City',
        country: 'Test Country',
        webSettings: {}
      };

      const expectedResult = { id: 1, ...restaurantDto };
      jest.spyOn(service, 'createRestaurant').mockResolvedValue(expectedResult);

      const result = await controller.create(restaurantDto);
      expect(result).toEqual({
        status: 201,
        restaurant: expectedResult
      });
    });
  });

  describe('getAll', () => {
    it('should return an array of restaurants', async () => {
      const expectedResult = [
        {
          id: 1,
          name: 'Test Restaurant',
          username: 'testrest',
          password: 'testpass',
          address: '123 Test St',
          city: 'Test City',
          country: 'Test Country',
          webSettings: {}
        }
      ];
      jest.spyOn(service, 'getAllRestaurants').mockResolvedValue(expectedResult);

      const result = await controller.getAll();
      expect(result).toEqual({
        status: 200,
        restaurants: expectedResult
      });
    });
  });

  describe('update', () => {
    it('should update a restaurant', async () => {
      const id = '1';
      const updateDto: RestaurantDto = {
        name: 'Updated Restaurant',
        username: 'updatedrest',
        password: 'updatedpass',
        address: '456 Update St',
        city: 'Update City',
        country: 'Update Country',
        webSettings: {}
      };

      const expectedResult = { id: parseInt(id), ...updateDto };
      jest.spyOn(service, 'getRestaurantById').mockResolvedValue(expectedResult);
      jest.spyOn(service, 'updateRestaurant').mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateDto, mockRequest);
      expect(result).toEqual({
        status: 200,
        restaurant: expectedResult
      });
    });

    it('should throw UnauthorizedException when user is not authenticated', async () => {
      const id = '1';
      const updateDto: RestaurantDto = {
        name: 'Updated Restaurant',
        username: 'updatedrest',
        password: 'updatedpass',
        address: '456 Update St',
        city: 'Update City',
        country: 'Update Country',
        webSettings: {}
      };

      await expect(controller.update(id, updateDto, mockRequestNoAuth))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException when updating other restaurant', async () => {
      const id = '2';
      const updateDto: RestaurantDto = {
        name: 'Updated Restaurant',
        username: 'updatedrest',
        password: 'updatedpass',
        address: '456 Update St',
        city: 'Update City',
        country: 'Update Country',
        webSettings: {}
      };

      await expect(controller.update(id, updateDto, mockRequest))
        .rejects.toThrow(ForbiddenException);
    });
  });
}); 