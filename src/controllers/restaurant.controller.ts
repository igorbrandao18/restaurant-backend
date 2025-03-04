import { Controller, Post, Get, Put, Body, Param, UseGuards, Req, NotFoundException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { RestaurantService } from '../services/restaurant.service';
import { RestaurantDto } from '../dto/restaurant.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../services/jwt-auth.guard';
import { Request } from 'express';

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
    status: 401, 
    description: 'Não autorizado'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acesso negado'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Restaurante não encontrado'
  })
  async update(@Param('id') id: string, @Body() restaurantData: RestaurantDto, @Req() req: Request) {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Check if user is trying to update their own data
    if (req.user.id !== +id) {
      throw new ForbiddenException('Cannot update other restaurant\'s data');
    }

    // Check if the restaurant exists
    const existingRestaurant = await this.restaurantService.getRestaurantById(+id);
    if (!existingRestaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    const updatedRestaurant = await this.restaurantService.updateRestaurant(+id, restaurantData);
    return { status: 200, restaurant: updatedRestaurant };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a restaurant by ID' })
  @ApiParam({ name: 'id', description: 'ID of the restaurant', type: 'number' })
  @ApiResponse({ status: 200, description: 'Restaurant found', type: RestaurantDto })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  async getById(@Param('id') id: string, @Req() req: Request) {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Check if user is trying to access their own data
    if (req.user.id !== +id) {
      throw new ForbiddenException('Cannot access other restaurant\'s data');
    }

    const restaurant = await this.restaurantService.getRestaurantById(+id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return { status: 200, restaurant };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated restaurant profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: RestaurantDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req: Request) {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const restaurant = await this.restaurantService.getRestaurantById(req.user.id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return { status: 200, restaurant };
  }

  @Get(':id/menus')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get restaurant menus' })
  @ApiParam({ name: 'id', description: 'ID of the restaurant', type: 'number' })
  @ApiResponse({ status: 200, description: 'Menus retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  async getMenus(@Param('id') id: string, @Req() req: Request) {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const restaurant = await this.restaurantService.getRestaurantById(+id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    
    // Check if the authenticated restaurant is trying to access its own menus
    if (req.user.id !== restaurant.id) {
      throw new ForbiddenException('Cannot access other restaurant\'s menus');
    }
    
    const menus = await this.restaurantService.getRestaurantMenus(+id);
    return { status: 200, menus };
  }
}
