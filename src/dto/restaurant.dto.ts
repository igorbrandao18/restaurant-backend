import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RestaurantDto {
  @ApiProperty({
    description: 'Nome do restaurante',
    example: 'Burger House'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Endereço do restaurante',
    example: 'Rua XX-X, 1-11'
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Cidade do restaurante',
    example: 'Bauru'
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'País do restaurante',
    example: 'BR'
  })
  @IsString()
  @IsNotEmpty()
  country: string;

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

  @ApiProperty({
    description: 'Configurações da interface web',
    example: {
      bannerImage: 'https://example.com/banner.jpg',
      backgroundColour: '#ffffff',
      primaryColour: '#4f372f',
      primaryColourHover: '#4f372f',
      navBackgroundColour: '#4f372f'
    }
  })
  @IsObject()
  webSettings: any;
}
