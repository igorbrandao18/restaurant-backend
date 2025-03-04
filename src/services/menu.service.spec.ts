import { MenuService } from './menu.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const menuService = new MenuService();

describe('MenuService', () => {
  it('should create a menu', async () => {
    const menuData = { restaurantId: 1, name: 'Test Menu', sections: {} };
    const menu = await menuService.createMenu(menuData);
    expect(menu).toHaveProperty('id');
  });

  it('should get all menus', async () => {
    const menus = await menuService.getAllMenus();
    expect(Array.isArray(menus)).toBe(true);
  });

  it('should update a menu', async () => {
    const menuData = { restaurantId: 1, name: 'Updated Menu', sections: {} };
    const menu = await menuService.createMenu(menuData);
    const updatedMenu = await menuService.updateMenu(menu.id, { restaurantId: 1, name: 'New Menu Name', sections: {} });
    expect(updatedMenu.name).toBe('New Menu Name');
  });
}); 