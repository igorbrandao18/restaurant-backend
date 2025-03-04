import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/services/auth.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            restaurant: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should authenticate a valid user and return a token', async () => {
      const hashedPassword = await argon2.hash('testpass');
      const mockUser = {
        id: 1,
        name: 'Test User',
        address: '123 Test St',
        city: 'Test City',
        country: 'Test Country',
        webSettings: {},
        username: 'testuser',
        password: hashedPassword
      };

      jest.spyOn(prismaService.restaurant, 'findUnique').mockResolvedValue(mockUser);

      const loginData = {
        username: 'testuser',
        password: 'testpass'
      };

      const result = await service.login(loginData);
      expect(result).toHaveProperty('token');

      const decoded = jwt.verify(result.token, process.env.JWT_SECRET || 'default_secret') as { id: number; username: string };
      expect(decoded).toHaveProperty('id', 1);
      expect(decoded).toHaveProperty('username', 'testuser');
    });

    it('should throw an error for invalid credentials', async () => {
      jest.spyOn(prismaService.restaurant, 'findUnique').mockResolvedValue(null);

      const loginData = {
        username: 'wronguser',
        password: 'wrongpass'
      };

      await expect(service.login(loginData)).rejects.toThrow('Invalid credentials');
    });

    it('should throw an error for incorrect password', async () => {
      const hashedPassword = await argon2.hash('correctpass');
      const mockUser = {
        id: 1,
        name: 'Test User',
        address: '123 Test St',
        city: 'Test City',
        country: 'Test Country',
        webSettings: {},
        username: 'testuser',
        password: hashedPassword
      };

      jest.spyOn(prismaService.restaurant, 'findUnique').mockResolvedValue(mockUser);

      const loginData = {
        username: 'testuser',
        password: 'wrongpass'
      };

      await expect(service.login(loginData)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('hashPassword', () => {
    it('should hash a password using argon2', async () => {
      const password = 'testpassword';
      const hashedPassword = await service.hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(await argon2.verify(hashedPassword, password)).toBe(true);
    });
  });
}); 