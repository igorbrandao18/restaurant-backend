import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MenuDto } from '../dto/menu.dto';

const prisma = new PrismaClient();

@Injectable()
export class MenuService {
  async createMenu(data: MenuDto) {
    return await prisma.menu.create({ data });
  }

  async getAllMenus() {
    return await prisma.menu.findMany();
  }

  async updateMenu(id: number, data: MenuDto) {
    return await prisma.menu.update({
      where: { id },
      data,
    });
  }
} 