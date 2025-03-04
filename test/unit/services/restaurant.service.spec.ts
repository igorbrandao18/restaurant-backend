import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from '../../../src/services/restaurant.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { AuthService } from '../../../src/services/auth.service';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let prismaService: PrismaService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<RestaurantService>(RestaurantService);
    prismaService = module.get<PrismaService>(PrismaService);
    authService = module.get<AuthService>(AuthService);

    // Mock hashPassword method
    jest.spyOn(authService, 'hashPassword').mockImplementation(async (password) => `hashed_${password}`);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRestaurant', () => {
    it('should create a restaurant', async () => {
      const restaurantData = {
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
        ...restaurantData,
        password: `hashed_${restaurantData.password}`
      };

      jest.spyOn(prismaService.restaurant, 'create').mockResolvedValue(mockRestaurant);

      const result = await service.createRestaurant(restaurantData);
      expect(result).toEqual(mockRestaurant);
    });
  });

  describe('getAllRestaurants', () => {
    it('should return an array of restaurants', async () => {
      const mockRestaurants = [
        {
          id: 1,
          name: 'Test Restaurant 1',
          address: '123 Test St',
          city: 'Test City',
          country: 'Test Country',
          username: 'testrestaurant1',
          password: 'hashedpassword1',
          webSettings: {}
        },
        {
          id: 2,
          name: 'Test Restaurant 2',
          address: '456 Test St',
          city: 'Test City',
          country: 'Test Country',
          username: 'testrestaurant2',
          password: 'hashedpassword2',
          webSettings: {}
        }
      ];

      jest.spyOn(prismaService.restaurant, 'findMany').mockResolvedValue(mockRestaurants);

      const result = await service.getAllRestaurants();
      expect(result).toEqual(mockRestaurants);
    });
  });

  describe('updateRestaurant', () => {
    it('should update a restaurant', async () => {
      const id = 1;
      const updateData = {
        name: 'Updated Restaurant',
        address: '456 Updated St',
        city: 'Updated City',
        country: 'Updated Country',
        username: `updatedrestaurant_${Date.now()}`,
        password: 'updatedpassword',
        webSettings: {}
      };

      const mockUpdatedRestaurant = {
        id,
        ...updateData,
        password: `hashed_${updateData.password}`
      };

      jest.spyOn(prismaService.restaurant, 'update').mockResolvedValue(mockUpdatedRestaurant);

      const result = await service.updateRestaurant(id, updateData);
      expect(result).toEqual(mockUpdatedRestaurant);
    });
  });
}); 