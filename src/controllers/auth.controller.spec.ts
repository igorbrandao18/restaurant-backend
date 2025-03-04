import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dto/auth.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should login successfully and return a token', async () => {
    const loginData: AuthDto = {
      username: 'testuser',
      password: 'testpass'
    };
    const mockToken = 'mock.jwt.token';
    
    jest.spyOn(authService, 'login').mockResolvedValue(mockToken);
    const result = await authController.login(loginData);
    
    expect(result).toEqual({ status: 200, token: mockToken });
  });

  it('should handle login failure', async () => {
    const loginData: AuthDto = {
      username: 'wronguser',
      password: 'wrongpass'
    };
    
    jest.spyOn(authService, 'login').mockRejectedValue(new Error('Invalid credentials'));
    
    await expect(authController.login(loginData)).rejects.toThrow('Invalid credentials');
  });
}); 