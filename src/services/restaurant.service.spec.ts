import { RestaurantService } from './restaurant.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const restaurantService = new RestaurantService();

describe('RestaurantService', () => {
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
    const restaurant = await restaurantService.createRestaurant(restaurantData);
    expect(restaurant).toHaveProperty('id');
  });

  it('should get all restaurants', async () => {
    const restaurants = await restaurantService.getAllRestaurants();
    expect(Array.isArray(restaurants)).toBe(true);
  });

  it('should update a restaurant', async () => {
    const restaurantData = {
      name: 'Updated Restaurant',
      address: '456 Updated St',
      city: 'Updated City',
      country: 'Updated Country',
      username: `updatedrestaurant_${Date.now()}`,
      password: 'updatedpassword',
      webSettings: {}
    };
    const restaurant = await restaurantService.createRestaurant(restaurantData);
    const updatedRestaurant = await restaurantService.updateRestaurant(restaurant.id, {
      ...restaurantData,
      name: 'New Name'
    });
    expect(updatedRestaurant.name).toBe('New Name');
  });
}); 