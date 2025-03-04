import { Test, TestingModule } from '@nestjs/testing';
import { MenuService } from '../../../src/services/menu.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { MenuDto } from '../../../src/dto/menu.dto';

describe('MenuService', () => {
  let service: MenuService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<MenuService>(MenuService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMenu', () => {
    it('should create a menu', async () => {
      const menuData: MenuDto = {
        restaurantId: 1,
        name: 'Test Menu',
        type: 'MENU',
        collapse: 0,
        sections: {
          sections: [
            {
              id: 1,
              name: 'Test Section',
              description: 'Test Section Description',
              position: 0,
              visible: 1,
              images: [
                {
                  id: 1,
                  image: 'https://example.com/image.jpg',
                },
              ],
              items: [
                {
                  id: 1,
                  name: 'Test Item',
                  description: 'Test Description',
                  alcoholic: 0,
                  price: 10.00,
                  position: 0,
                  visible: 1,
                  availabilityType: 'AVAILABLE_NOW',
                  sku: 'TEST123',
                  images: [],
                  modifiers: [],
                  available: true,
                },
              ],
            },
          ],
        },
      };

      const mockMenu = {
        id: 1,
        restaurantId: menuData.restaurantId,
        name: menuData.name,
        type: menuData.type,
        collapse: menuData.collapse,
        sections: menuData.sections,
      };

      jest.spyOn(prismaService.menu, 'create').mockResolvedValue(mockMenu);

      const result = await service.createMenu(menuData);
      expect(result).toEqual(mockMenu);
    });
  });

  describe('getAllMenus', () => {
    it('should return an array of menus', async () => {
      const mockMenus = [{
        id: 1,
        restaurantId: 1,
        name: 'Test Menu',
        type: 'MENU',
        collapse: 0,
        sections: {
          sections: [],
        },
      }];

      jest.spyOn(prismaService.menu, 'findMany').mockResolvedValue(mockMenus);
      const result = await service.getAllMenus();
      expect(result).toEqual(mockMenus);
    });
  });

  describe('updateMenu', () => {
    it('should update a menu', async () => {
      const id = 1;
      const updateData: MenuDto = {
        restaurantId: 1,
        name: 'Updated Menu',
        type: 'MENU',
        collapse: 0,
        sections: {
          sections: [],
        },
      };

      const mockUpdatedMenu = {
        id,
        ...updateData,
      };

      jest.spyOn(prismaService.menu, 'update').mockResolvedValue(mockUpdatedMenu);

      const result = await service.updateMenu(id, updateData);
      expect(result).toEqual(mockUpdatedMenu);
    });
  });
}); 