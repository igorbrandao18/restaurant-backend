import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { HttpExceptionFilter } from '../../src/filters/http-exception.filter';
import { OrderStatus } from '../../src/dto/order.dto';

describe('Restaurant System (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let restaurantId: number;
  let menuId: number;
  let orderId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Configurar pipes e filtros globais como na aplicação real
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    }));
    app.useGlobalFilters(new HttpExceptionFilter());
    
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Full System Flow', () => {
    it('should complete a full order flow', async () => {
      // 1. Registrar um novo restaurante
      const restaurantData = {
        name: 'Test Restaurant',
        address: '123 Test St',
        city: 'Test City',
        country: 'Test Country',
        username: `testrestaurant_${Date.now()}`,
        password: 'testpassword',
        webSettings: {}
      };

      const registerResponse = await request(app.getHttpServer())
        .post('/restaurants')
        .send(restaurantData)
        .expect(201);

      restaurantId = registerResponse.body.restaurant.id;
      expect(registerResponse.body.restaurant.name).toBe(restaurantData.name);

      // 2. Autenticar o restaurante
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: restaurantData.username,
          password: restaurantData.password
        })
        .expect(201);

      authToken = loginResponse.body.token;
      expect(authToken).toBeDefined();

      // 3. Criar um menu
      const menuData = {
        restaurantId,
        name: 'Test Menu',
        type: 'MENU',
        collapse: 0,
        sections: {
          sections: [
            {
              id: 1,
              name: 'Test Section',
              description: 'Test Description',
              position: 0,
              visible: 1,
              items: [
                {
                  id: 1,
                  name: 'Test Item',
                  description: 'Test Description',
                  alcoholic: 0,
                  price: 15.99,
                  position: 0,
                  visible: 1,
                  availabilityType: 'AVAILABLE_NOW',
                  sku: 'TEST123',
                  available: true
                }
              ]
            }
          ]
        }
      };

      const menuResponse = await request(app.getHttpServer())
        .post('/menus')
        .set('Authorization', `Bearer ${authToken}`)
        .send(menuData)
        .expect(201);

      menuId = menuResponse.body.menu.id;
      const menuItemId = menuResponse.body.menu.sections.sections[0].items[0].id;

      // 4. Criar um pedido
      const orderData = {
        restaurantId,
        customerId: 1,
        items: {
          items: [
            {
              menuItemId,
              quantity: 2
            }
          ]
        },
        total: 31.98, // 2 * 15.99
        status: OrderStatus.PENDING
      };

      const orderResponse = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(orderData)
        .expect(201);

      orderId = orderResponse.body.order.id;
      expect(orderResponse.body.order.total).toBe(orderData.total);

      // 5. Atualizar status do pedido
      const statusUpdates = [OrderStatus.ACCEPTED, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.DELIVERED];
      
      for (const status of statusUpdates) {
        await request(app.getHttpServer())
          .put(`/orders/${orderId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ 
            ...orderData,
            status 
          })
          .expect(200);

        // Verificar se o status foi atualizado no banco
        const updatedOrder = await prisma.order.findUnique({
          where: { id: orderId }
        });
        expect(updatedOrder?.status).toBe(status);
      }

      // 6. Verificar histórico de pedidos
      const historyResponse = await request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(historyResponse.body.orders).toHaveLength(1);
      expect(historyResponse.body.orders[0].id).toBe(orderId);
    });

    it('should handle concurrent orders correctly', async () => {
      const createOrder = (index: number) => {
        return request(app.getHttpServer())
          .post('/orders')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            restaurantId,
            customerId: index,
            items: {
              items: [
                {
                  menuItemId: 1,
                  quantity: 1
                }
              ]
            },
            total: 15.99,
            status: OrderStatus.PENDING
          });
      };

      // Criar 5 pedidos simultaneamente
      const orderPromises = Array.from({ length: 5 }, (_, i) => createOrder(i + 1));
      const responses = await Promise.all(orderPromises);

      // Verificar se todos os pedidos foram criados com sucesso
      responses.forEach(response => {
        expect(response.status).toBe(201);
        expect(response.body.order).toHaveProperty('id');
      });

      // Verificar se todos os pedidos estão no banco
      const orders = await prisma.order.findMany({
        where: { restaurantId }
      });
      expect(orders.length).toBeGreaterThanOrEqual(6); // 5 novos + 1 do teste anterior
    });

    it('should handle errors appropriately', async () => {
      // Tentar criar pedido com dados inválidos
      await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          restaurantId,
          customerId: 1,
          items: {
            items: [
              {
                menuItemId: 99999,
                quantity: 1
              }
            ]
          },
          total: 15.99,
          status: OrderStatus.PENDING
        })
        .expect(400);

      // Tentar acessar pedido sem autenticação
      await request(app.getHttpServer())
        .get('/orders')
        .expect(401);

      // Tentar criar menu com dados inválidos
      await request(app.getHttpServer())
        .post('/menus')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          restaurantId: 99999,
          name: 'Test Menu',
          type: 'INVALID_TYPE',
          sections: {}
        })
        .expect(400);
    });

    it('should handle restaurant profile updates', async () => {
      const updateData = {
        name: 'Updated Restaurant Name',
        address: '456 New St',
        city: 'New City',
        country: 'New Country',
        username: `updated_${Date.now()}`,
        password: 'newpassword',
        webSettings: {
          theme: 'dark',
          logo: 'https://example.com/logo.png'
        }
      };

      await request(app.getHttpServer())
        .put(`/restaurants/${restaurantId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      // Verificar se as atualizações foram salvas
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId }
      });

      expect(restaurant).toBeDefined();
      expect(restaurant?.name).toBe(updateData.name);
      expect(restaurant?.address).toBe(updateData.address);
      expect(restaurant?.city).toBe(updateData.city);
      expect(restaurant?.country).toBe(updateData.country);
      expect(restaurant?.webSettings).toEqual(updateData.webSettings);
    });
  });
}); 