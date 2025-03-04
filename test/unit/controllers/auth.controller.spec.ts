import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../src/controllers/auth.controller';
import { AuthService } from '../../../src/services/auth.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { LoginDto } from '../../../src/dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a token when credentials are valid', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'testpass',
      };

      const expectedResponse = { token: 'test-token' };
      jest.spyOn(authService, 'login').mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);
      expect(result).toEqual({ status: 200, ...expectedResponse });
    });
  });
}); 