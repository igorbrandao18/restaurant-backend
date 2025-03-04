import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MenuDto } from '../dto/menu.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async createMenu(data: MenuDto) {
    return await this.prisma.menu.create({
      data: {
        restaurantId: data.restaurantId,
        name: data.name,
        type: data.type,
        collapse: data.collapse,
        sections: data.sections,
      },
    });
  }

  async getAllMenus() {
    return await this.prisma.menu.findMany();
  }

  async updateMenu(id: number, data: MenuDto) {
    return await this.prisma.menu.update({
      where: { id },
      data: {
        restaurantId: data.restaurantId,
        name: data.name,
        type: data.type,
        collapse: data.collapse,
        sections: data.sections,
      },
    });
  }
} 