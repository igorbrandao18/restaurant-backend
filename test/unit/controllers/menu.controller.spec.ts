import { Test, TestingModule } from '@nestjs/testing';
import { MenuController } from '../../../src/controllers/menu.controller';
import { MenuService } from '../../../src/services/menu.service';
import { MenuDto } from '../../../src/dto/menu.dto';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { RestaurantService } from '../../../src/services/restaurant.service';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthService } from '../../../src/services/auth.service';

describe('MenuController', () => {
  let menuController: MenuController;
  let menuService: MenuService;
  let restaurantService: RestaurantService;

  const mockRequest = {
    user: {
      restaurantId: 1
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [
        MenuService,
        RestaurantService,
        {
          provide: AuthService,
          useValue: {
            validateToken: jest.fn(),
            generateToken: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            menu: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            restaurant: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    menuController = module.get<MenuController>(MenuController);
    menuService = module.get<MenuService>(MenuService);
    restaurantService = module.get<RestaurantService>(RestaurantService);
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
    const result = await menuController.create(mockRequest, menuData);
    expect(result).toEqual({ status: 201, menu: { id: 1, ...menuData } });
  });

  it('should throw UnauthorizedException when creating menu without authentication', async () => {
    const menuData: MenuDto = { 
      restaurantId: 1, 
      name: 'Test Menu', 
      type: 'MENU',
      collapse: 0,
      sections: {} 
    };
    await expect(menuController.create({ user: null }, menuData))
      .rejects.toThrow(UnauthorizedException);
  });

  it('should get all menus for authenticated restaurant', async () => {
    const menus = [
      { id: 1, restaurantId: 1, name: 'Menu 1', type: 'MENU', collapse: 0, sections: {} },
      { id: 2, restaurantId: 2, name: 'Menu 2', type: 'MENU', collapse: 0, sections: {} },
      { id: 3, restaurantId: 1, name: 'Menu 3', type: 'MENU', collapse: 0, sections: {} }
    ];
    jest.spyOn(menuService, 'getAllMenus').mockResolvedValue(menus);
    const result = await menuController.getAll(mockRequest);
    expect(result).toEqual({ 
      status: 200, 
      menus: menus.filter(menu => menu.restaurantId === mockRequest.user.restaurantId) 
    });
  });

  it('should throw UnauthorizedException when getting menus without authentication', async () => {
    await expect(menuController.getAll({ user: null }))
      .rejects.toThrow(UnauthorizedException);
  });

  it('should update menu', async () => {
    const menuId = '1';
    const menuData: MenuDto = { 
      restaurantId: 1, 
      name: 'Updated Menu', 
      type: 'MENU',
      collapse: 0,
      sections: {} 
    };
    const existingMenu = { id: 1, ...menuData };
    
    jest.spyOn(menuService, 'getMenuById').mockResolvedValue(existingMenu);
    jest.spyOn(menuService, 'updateMenu').mockResolvedValue({ id: 1, ...menuData });
    
    const result = await menuController.update(mockRequest, menuId, menuData);
    expect(result).toEqual({ status: 200, menu: { id: 1, ...menuData } });
  });

  it('should throw ForbiddenException when updating menu from another restaurant', async () => {
    const menuId = '1';
    const menuData: MenuDto = { 
      restaurantId: 2, 
      name: 'Updated Menu', 
      type: 'MENU',
      collapse: 0,
      sections: {} 
    };
    const existingMenu = { id: 1, ...menuData };
    
    jest.spyOn(menuService, 'getMenuById').mockResolvedValue(existingMenu);
    
    await expect(menuController.update(mockRequest, menuId, menuData))
      .rejects.toThrow(ForbiddenException);
  });
}); 