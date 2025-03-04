import { IsNumber, IsArray, ValidateNested, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({
    description: 'ID do item do menu',
    example: 1
  })
  @IsNumber()
  menuItemId: number;

  @ApiProperty({
    description: 'Quantidade do item',
    example: 2
  })
  @IsNumber()
  quantity: number;
}

export class OrderItemsDto {
  @ApiProperty({
    description: 'Lista de itens do pedido',
    type: [OrderItemDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
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
    type: OrderItemsDto
  })
  @ValidateNested()
  @Type(() => OrderItemsDto)
  items: OrderItemsDto;

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