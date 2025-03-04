import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { HttpExceptionFilter } from '../../src/filters/http-exception.filter';

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
    app.useGlobalPipes(new ValidationPipe());
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
        username: 'testrestaurant',
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
        .expect(200);

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
              id: menuItemId,
              quantity: 2
            }
          ]
        },
        total: 31.98, // 2 * 15.99
        status: 'PENDING'
      };

      const orderResponse = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(orderData)
        .expect(201);

      orderId = orderResponse.body.order.id;
      expect(orderResponse.body.order.total).toBe(orderData.total);

      // 5. Atualizar status do pedido
      const statusUpdates = ['ACCEPTED', 'PREPARING', 'READY', 'DELIVERED'];
      
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
          where: { id: orderId },
          select: {
            id: true,
            restaurantId: true,
            customerId: true,
            items: true,
            total: true,
            status: true
          }
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
              items: [{ id: 1, quantity: 1 }]
            },
            total: 15.99,
            status: 'PENDING'
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
      // Tentar criar pedido com item inválido
      await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          restaurantId,
          customerId: 1,
          items: {
            items: [{ id: 99999, quantity: 1 }]
          },
          total: 15.99
        })
        .expect(400);

      // Tentar acessar pedido de outro restaurante
      const fakeToken = 'fake.token.here';
      await request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', `Bearer ${fakeToken}`)
        .expect(401);

      // Tentar criar menu com dados inválidos
      await request(app.getHttpServer())
        .post('/menus')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          restaurantId: 99999, // ID inválido
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

      expect(restaurant?.name).toBe(updateData.name);
      expect(restaurant?.address).toBe(updateData.address);
      expect(restaurant?.webSettings).toEqual(updateData.webSettings);
    });
  });
}); 