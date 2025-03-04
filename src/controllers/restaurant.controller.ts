import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { RestaurantService } from '../services/restaurant.service';
import { RestaurantDto } from '../dto/restaurant.dto';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  async create(@Body() restaurantData: RestaurantDto) {
    const restaurant = await this.restaurantService.createRestaurant(restaurantData);
    return { status: 201, restaurant };
  }

  @Get()
  async getAll() {
    const restaurants = await this.restaurantService.getAllRestaurants();
    return { status: 200, restaurants };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() restaurantData: RestaurantDto) {
    const updatedRestaurant = await this.restaurantService.updateRestaurant(+id, restaurantData);
    return { status: 200, updatedRestaurant };
  }
}
