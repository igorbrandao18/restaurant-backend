import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { MenuService } from '../services/menu.service';
import { MenuDto } from '../dto/menu.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('menus')
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

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
  async create(@Body() menuData: MenuDto) {
    const menu = await this.menuService.createMenu(menuData);
    return { status: 201, menu };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os menus' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de menus retornada com sucesso',
    type: [MenuDto]
  })
  async getAll() {
    const menus = await this.menuService.getAllMenus();
    return { status: 200, menus };
  }

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
    status: 404, 
    description: 'Menu não encontrado'
  })
  async update(@Param('id') id: string, @Body() menuData: MenuDto) {
    const updatedMenu = await this.menuService.updateMenu(+id, menuData);
    return { status: 200, updatedMenu };
  }
} 