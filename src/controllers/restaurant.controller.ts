import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { RestaurantService } from '../services/restaurant.service';
import { RestaurantDto } from '../dto/restaurant.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo restaurante' })
  @ApiResponse({ 
    status: 201, 
    description: 'Restaurante criado com sucesso',
    type: RestaurantDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos'
  })
  async create(@Body() restaurantData: RestaurantDto) {
    const restaurant = await this.restaurantService.createRestaurant(restaurantData);
    return { status: 201, restaurant };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os restaurantes' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de restaurantes retornada com sucesso',
    type: [RestaurantDto]
  })
  async getAll() {
    const restaurants = await this.restaurantService.getAllRestaurants();
    return { status: 200, restaurants };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um restaurante existente' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do restaurante a ser atualizado',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Restaurante atualizado com sucesso',
    type: RestaurantDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Restaurante não encontrado'
  })
  async update(@Param('id') id: string, @Body() restaurantData: RestaurantDto) {
    const updatedRestaurant = await this.restaurantService.updateRestaurant(+id, restaurantData);
    return { status: 200, updatedRestaurant };
  }
}
