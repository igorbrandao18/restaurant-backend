import { IsNumber, IsArray, ValidateNested, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @IsNumber()
  menuItemId: number;

  @IsNumber()
  quantity: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ACCEPTED = 'ACCEPTED',
  DELIVERED = 'DELIVERED'
}

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
  items: { items: OrderItemDto[] };

  @ApiProperty({
    description: 'Valor total do pedido',
    example: 51.80
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    description: 'Status do pedido',
    enum: OrderStatus,
    example: OrderStatus.PENDING
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
} 