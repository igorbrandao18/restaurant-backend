import { Test, TestingModule } from '@nestjs/testing';
import { MenuController } from './menu.controller';
import { MenuService } from '../services/menu.service';
import { MenuDto } from '../dto/menu.dto';
import { PrismaService } from '../prisma/prisma.service';

describe('MenuController', () => {
  let menuController: MenuController;
  let menuService: MenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [
        MenuService,
        {
          provide: PrismaService,
          useValue: {
            menu: {
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    menuController = module.get<MenuController>(MenuController);
    menuService = module.get<MenuService>(MenuService);
  });

  it('should create a menu', async () => {
    const menuData: MenuDto = { 
      restaurantId: 1, 
      name: 'Test Menu', 
      type: 'MENU',
      collapse: 0,
      sections: {} 
    };
    jest.spyOn(menuService, 'createMenu').mockResolvedValue({ id: 1, ...menuData });
    const result = await menuController.create(menuData);
    expect(result).toEqual({ status: 201, menu: { id: 1, ...menuData } });
  });

  it('should get all menus', async () => {
    jest.spyOn(menuService, 'getAllMenus').mockResolvedValue([]);
    const result = await menuController.getAll();
    expect(result).toEqual({ status: 200, menus: [] });
  });
}); 