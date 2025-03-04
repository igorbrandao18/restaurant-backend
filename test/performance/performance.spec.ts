import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { HttpExceptionFilter } from '../../src/filters/http-exception.filter';

describe('Performance Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let restaurantId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();

    // Create a restaurant for testing
    const restaurantResponse = await request(app.getHttpServer())
      .post('/restaurants')
      .send({
        name: 'Performance Test Restaurant',
        address: '123 Performance St',
        city: 'Performance City',
        country: 'Performance Country',
        username: `perftest_${Date.now()}`, // Make username unique
        password: 'perfpass123',
        webSettings: {}
      });

    expect(restaurantResponse.status).toBe(201);
    expect(restaurantResponse.body.restaurant).toBeDefined();
    restaurantId = restaurantResponse.body.restaurant.id;

    // Authenticate
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: restaurantResponse.body.restaurant.username,
        password: 'perfpass123'
      });

    expect(loginResponse.status).toBe(201);
    expect(loginResponse.body.token).toBeDefined();
    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Response Time Tests', () => {
    it('should respond to GET /restaurants within 200ms', async () => {
      const startTime = Date.now();
      
      const response = await request(app.getHttpServer())
        .get('/restaurants')
        .expect(200);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(200);
      expect(response.body.restaurants).toBeDefined();
    });

    it('should respond to GET /menus within 300ms', async () => {
      const startTime = Date.now();
      
      const response = await request(app.getHttpServer())
        .get('/menus')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(300);
      expect(response.body.menus).toBeDefined();
    });

    it('should process order creation within 500ms', async () => {
      const startTime = Date.now();
      
      const response = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          restaurantId,
          customerId: 1,
          items: {
            items: [
              { menuItemId: 1, quantity: 2 }
            ]
          },
          total: 29.98,
          status: 'PENDING'
        })
        .expect(201);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(500);
      expect(response.body.order).toBeDefined();
    });
  });

  describe('Concurrent Request Tests', () => {
    it('should handle 50 concurrent GET requests', async () => {
      const requests = Array(50).fill(null).map(() => 
        request(app.getHttpServer())
          .get('/restaurants')
          .expect(200)
      );
      
      const startTime = Date.now();
      await Promise.all(requests);
      const endTime = Date.now();
      
      const totalTime = endTime - startTime;
      expect(totalTime).toBeLessThan(2000); // 2 seconds for 50 requests
    });

    it('should handle 20 concurrent order creations', async () => {
      const requests = Array(20).fill(null).map(() => 
        request(app.getHttpServer())
          .post('/orders')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            restaurantId,
            customerId: 1,
            items: {
              items: [
                { menuItemId: 1, quantity: 1 }
              ]
            },
            total: 14.99,
            status: 'PENDING'
          })
          .expect(201)
      );
      
      const startTime = Date.now();
      await Promise.all(requests);
      const endTime = Date.now();
      
      const totalTime = endTime - startTime;
      expect(totalTime).toBeLessThan(3000); // 3 seconds for 20 orders
    });
  });

  describe('Database Performance Tests', () => {
    it('should efficiently query large dataset', async () => {
      const startTime = Date.now();
      
      const response = await request(app.getHttpServer())
        .get('/restaurants')
        .expect(200);
      
      const endTime = Date.now();
      const queryTime = endTime - startTime;
      
      expect(queryTime).toBeLessThan(100);
      expect(response.body.restaurants).toBeDefined();
    });

    it('should handle complex joins efficiently', async () => {
      const startTime = Date.now();
      
      const response = await request(app.getHttpServer())
        .get(`/restaurants/${restaurantId}/menus`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      const endTime = Date.now();
      const queryTime = endTime - startTime;
      
      expect(queryTime).toBeLessThan(300);
      expect(response.body.menus).toBeDefined();
    });
  });

  describe('Memory Usage Tests', () => {
    it('should maintain stable memory usage during bulk operations', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Perform bulk operation
      await Promise.all(Array(100).fill(null).map(() => 
        request(app.getHttpServer())
          .get('/restaurants')
          .expect(200)
      ));
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be less than 50MB
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });

  describe('Cache Performance Tests', () => {
    it('should cache restaurant data effectively', async () => {
      // First request (uncached)
      const firstStart = Date.now();
      await request(app.getHttpServer())
        .get(`/restaurants/${restaurantId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      const firstTime = Date.now() - firstStart;
      
      // Second request (should be cached)
      const secondStart = Date.now();
      await request(app.getHttpServer())
        .get(`/restaurants/${restaurantId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      const secondTime = Date.now() - secondStart;
      
      // Cached request should be significantly faster
      expect(secondTime).toBeLessThan(firstTime * 0.8);
    });
  });
}); 