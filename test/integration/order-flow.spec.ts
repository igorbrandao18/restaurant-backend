import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { RestaurantDto } from '../../src/dto/restaurant.dto';
import { MenuDto } from '../../src/dto/menu.dto';
import { OrderDto } from '../../src/dto/order.dto';

describe('Order Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // Clean the database before each test
    await prisma.order.deleteMany();
    await prisma.menu.deleteMany();
    await prisma.restaurant.deleteMany();
  });

  it('should create a complete order flow', async () => {
    // 1. Create a restaurant
    const restaurantDto: RestaurantDto = {
      name: 'Test Restaurant',
      address: 'Test Address',
      city: 'Test City',
      country: 'Test Country',
      username: 'testrestaurant',
      password: 'testpassword',
      webSettings: {
        primaryColor: '#000000',
        secondaryColor: '#FFFFFF',
      },
    };

    const restaurantResponse = await request(app.getHttpServer())
      .post('/restaurants')
      .send(restaurantDto)
      .expect(201);

    const restaurantId = restaurantResponse.body.id;

    // 2. Create a menu item
    const menuItemDto = {
      name: 'Test Item',
      description: 'Test Description',
      price: 10.99,
      category: 'Test Category',
      restaurantId,
    };

    const menuResponse = await request(app.getHttpServer())
      .post('/menu')
      .send(menuItemDto)
      .expect(201);

    const menuItemId = menuResponse.body.id;

    // 3. Create an order
    const orderDto: OrderDto = {
      restaurantId,
      customerId: 1, // Assuming a customer exists
      items: {
        items: [
          {
            menuId: menuItemId,
            quantity: 2,
            price: 10.99,
            notes: 'No onions',
          },
        ],
      },
      total: 21.98,
    };

    const orderResponse = await request(app.getHttpServer())
      .post('/orders')
      .send(orderDto)
      .expect(201);

    // 4. Verify the order in database
    const order = await prisma.order.findUnique({
      where: { id: orderResponse.body.id },
      include: { items: true },
    });

    expect(order).toBeDefined();
    expect(order?.restaurantId).toBe(restaurantId);
    expect(order?.customerId).toBe(1);
    expect(order?.total).toBe(21.98);
    expect(order?.items).toHaveLength(1);
    expect(order?.items[0].menuId).toBe(menuItemId);
    expect(order?.items[0].quantity).toBe(2);
  });
}); 