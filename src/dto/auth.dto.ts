import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    description: 'Nome de usuário para autenticação',
    example: 'burgerhouse'
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Senha para autenticação',
    example: 'senha123'
  })
  @IsString()
  @IsNotEmpty()
  password: string;
} 