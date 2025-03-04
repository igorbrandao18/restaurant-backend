import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Autenticar um restaurante' })
  @ApiResponse({ 
    status: 200, 
    description: 'Autenticação realizada com sucesso',
    schema: {
      properties: {
        status: { type: 'number', example: 200 },
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciais inválidas'
  })
  async login(@Body() loginData: LoginDto) {
    const result = await this.authService.login(loginData);
    return { status: 200, ...result };
  }
} 