import { AuthService } from './auth.service';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const authService = new AuthService();

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      restaurant: {
        findUnique: jest.fn().mockResolvedValue({
          id: 1,
          username: 'testuser',
          password: 'testpass'
        })
      }
    }))
  };
});

describe('AuthService', () => {
  it('should authenticate a valid user and return a token', async () => {
    const loginData = {
      username: 'testuser',
      password: 'testpass'
    };

    const token = await authService.login(loginData);
    expect(typeof token).toBe('string');

    // Verify the token structure
    const decoded = jwt.verify(token, 'your_jwt_secret') as { id: number };
    expect(decoded).toHaveProperty('id', 1);
  });

  it('should throw an error for invalid credentials', async () => {
    // Mock the findUnique to return null (user not found)
    jest.spyOn(prisma.restaurant, 'findUnique').mockResolvedValueOnce(null);

    const loginData = {
      username: 'wronguser',
      password: 'wrongpass'
    };

    await expect(authService.login(loginData)).rejects.toThrow('Invalid credentials');
  });

  it('should throw an error for incorrect password', async () => {
    // Mock the findUnique to return a user with different password
    jest.spyOn(prisma.restaurant, 'findUnique').mockResolvedValueOnce({
      id: 1,
      username: 'testuser',
      password: 'differentpass'
    } as any);

    const loginData = {
      username: 'testuser',
      password: 'wrongpass'
    };

    await expect(authService.login(loginData)).rejects.toThrow('Invalid credentials');
  });
}); 