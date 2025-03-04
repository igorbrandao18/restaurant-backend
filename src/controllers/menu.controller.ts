import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { MenuService } from '../services/menu.service';
import { MenuDto } from '../dto/menu.dto';

@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  async create(@Body() menuData: MenuDto) {
    const menu = await this.menuService.createMenu(menuData);
    return { status: 201, menu };
  }

  @Get()
  async getAll() {
    const menus = await this.menuService.getAllMenus();
    return { status: 200, menus };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() menuData: MenuDto) {
    const updatedMenu = await this.menuService.updateMenu(+id, menuData);
    return { status: 200, updatedMenu };
  }
} 