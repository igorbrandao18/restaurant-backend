import { IsNumber, IsObject } from 'class-validator';

export class OrderDto {
  @IsNumber()
  restaurantId: number;

  @IsNumber()
  customerId: number;

  @IsObject()
  items: any;

  @IsNumber()
  total: number;
} 