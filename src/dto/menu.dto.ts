import { IsNumber, IsString, IsObject, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MenuDto {
  @ApiProperty({
    description: 'ID do restaurante ao qual o menu pertence',
    example: 1
  })
  @IsNumber()
  restaurantId: number;

  @ApiProperty({
    description: 'Nome do menu',
    example: 'Menu Principal'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Tipo do menu',
    example: 'MENU'
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Estado de colapso do menu (0 para expandido, 1 para colapsado)',
    example: 0
  })
  @IsNumber()
  collapse: number;

  @ApiProperty({
    description: 'Seções do menu contendo categorias e itens',
    example: {
      sections: [
        {
          id: 1,
          name: 'Burgers',
          description: 'Deliciosos hambúrgueres artesanais',
          position: 0,
          visible: 1,
          items: [
            {
              id: 1,
              name: 'Classic Burger',
              description: 'Hambúrguer clássico com queijo e bacon',
              price: 25.90,
              available: true
            }
          ]
        }
      ]
    }
  })
  @IsObject()
  sections: any;
} 