import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { RestaurantDto } from '../../src/dto/restaurant.dto';
import { AuthDto } from '../../src/dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

describe('Authentication Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  beforeEach(async () => {
    // Clean the database before each test
    await prisma.restaurant.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Authentication', () => {
    it('should authenticate a restaurant with valid credentials', async () => {
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

      await request(app.getHttpServer())
        .post('/restaurants')
        .send(restaurantDto)
        .expect(201);

      // 2. Attempt to login
      const authDto: AuthDto = {
        username: 'testrestaurant',
        password: 'testpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(authDto)
        .expect(200);

      expect(response.body.token).toBeDefined();
      
      // 3. Verify JWT token
      const decodedToken = jwtService.verify(response.body.token);
      expect(decodedToken.username).toBe(authDto.username);
    });

    it('should fail authentication with invalid credentials', async () => {
      const authDto: AuthDto = {
        username: 'nonexistent',
        password: 'wrongpassword',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(authDto)
        .expect(401);
    });

    it('should protect routes that require authentication', async () => {
      // Try to access protected route without token
      await request(app.getHttpServer())
        .get('/restaurants/profile')
        .expect(401);

      // Create and authenticate a restaurant
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

      await request(app.getHttpServer())
        .post('/restaurants')
        .send(restaurantDto)
        .expect(201);

      const authResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'testrestaurant',
          password: 'testpassword',
        })
        .expect(200);

      // Access protected route with valid token
      await request(app.getHttpServer())
        .get('/restaurants/profile')
        .set('Authorization', `Bearer ${authResponse.body.token}`)
        .expect(200);
    });

    it('should reject expired tokens', async () => {
      // Create a restaurant
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

      await request(app.getHttpServer())
        .post('/restaurants')
        .send(restaurantDto)
        .expect(201);

      // Create an expired token
      const expiredToken = jwtService.sign(
        { username: 'testrestaurant' },
        { expiresIn: '0s' }
      );

      // Try to access protected route with expired token
      await request(app.getHttpServer())
        .get('/restaurants/profile')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });
  });
}); 