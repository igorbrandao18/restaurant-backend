import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dto/auth.dto';
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
  async login(@Body() authData: AuthDto) {
    const token = await this.authService.login(authData);
    return { status: 200, token };
  }
} 