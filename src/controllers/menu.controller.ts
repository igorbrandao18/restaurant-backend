import { Controller, Post, Get, Put, Body, Param, UseGuards, Request, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { MenuService } from '../services/menu.service';
import { MenuDto } from '../dto/menu.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../services/jwt-auth.guard';
import { RestaurantService } from '../services/restaurant.service';

@ApiTags('menus')
@ApiBearerAuth()
@Controller('menus')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly restaurantService: RestaurantService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar um novo menu' })
  @ApiResponse({ 
    status: 201, 
    description: 'Menu criado com sucesso',
    type: MenuDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado'
  })
  async create(@Request() req, @Body() menuData: MenuDto) {
    if (!req.user || !req.user.restaurantId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    
    menuData.restaurantId = req.user.restaurantId;
    const menu = await this.menuService.createMenu(menuData);
    return { status: 201, menu };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Listar todos os menus do restaurante autenticado' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de menus retornada com sucesso',
    type: [MenuDto]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado'
  })
  async getAll(@Request() req) {
    if (!req.user || !req.user.restaurantId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    
    const menus = await this.menuService.getAllMenus();
    const restaurantMenus = menus.filter(menu => menu.restaurantId === req.user.restaurantId);
    return { status: 200, menus: restaurantMenus };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um menu existente' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do menu a ser atualizado',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Menu atualizado com sucesso',
    type: MenuDto
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
    description: 'Menu não encontrado'
  })
  async update(@Request() req, @Param('id') id: string, @Body() menuData: MenuDto) {
    if (!req.user || !req.user.restaurantId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const existingMenu = await this.menuService.getMenuById(+id);
    if (!existingMenu) {
      throw new ForbiddenException('Menu não encontrado');
    }

    if (existingMenu.restaurantId !== req.user.restaurantId) {
      throw new ForbiddenException('Você não tem permissão para atualizar este menu');
    }
    
    menuData.restaurantId = req.user.restaurantId;
    const updatedMenu = await this.menuService.updateMenu(+id, menuData);
    return { status: 200, menu: updatedMenu };
  }
} 