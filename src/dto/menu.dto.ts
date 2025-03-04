import { IsNumber, IsString, IsObject, IsNotEmpty } from 'class-validator';

export class MenuDto {
  @IsNumber()
  restaurantId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  sections: any;
} 