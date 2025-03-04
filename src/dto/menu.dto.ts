import { IsNumber, IsString, IsObject, IsNotEmpty } from 'class-validator';

export class MenuDto {
  @IsNumber()
  restaurantId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  type: string;

  @IsNumber()
  collapse: number;

  @IsObject()
  sections: any;
} 