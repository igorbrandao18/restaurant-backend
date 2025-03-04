import { IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
  @ApiProperty({
    description: 'ID do restaurante ao qual o pedido pertence',
    example: 1
  })
  @IsNumber()
  restaurantId: number;

  @ApiProperty({
    description: 'ID do cliente que fez o pedido',
    example: 1
  })
  @IsNumber()
  customerId: number;

  @ApiProperty({
    description: 'Itens do pedido',
    example: {
      items: [
        {
          menuId: 1,
          quantity: 2,
          price: 25.90,
          notes: 'Sem cebola'
        }
      ]
    }
  })
  @IsObject()
  items: any;

  @ApiProperty({
    description: 'Valor total do pedido',
    example: 51.80
  })
  @IsNumber()
  total: number;
} 