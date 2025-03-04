import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from '../services/restaurant.service';
import { RestaurantDto } from '../dto/restaurant.dto';

describe('RestaurantController', () => {
  let restaurantController: RestaurantController;
  let restaurantService: RestaurantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [RestaurantService],
    }).compile();

    restaurantController = module.get<RestaurantController>(RestaurantController);
    restaurantService = module.get<RestaurantService>(RestaurantService);
  });

  it('should create a restaurant', async () => {
    const restaurantData: RestaurantDto = {
      name: 'Test Restaurant',
      address: '123 Test St',
      city: 'Test City',
      country: 'Test Country',
      username: 'testrestaurant',
      password: 'testpassword',
      webSettings: {}
    };
    jest.spyOn(restaurantService, 'createRestaurant').mockResolvedValue({ id: 1, ...restaurantData });
    const result = await restaurantController.create(restaurantData);
    expect(result).toEqual({ status: 201, restaurant: { id: 1, ...restaurantData } });
  });

  it('should get all restaurants', async () => {
    jest.spyOn(restaurantService, 'getAllRestaurants').mockResolvedValue([]);
    const result = await restaurantController.getAll();
    expect(result).toEqual({ status: 200, restaurants: [] });
  });
}); 