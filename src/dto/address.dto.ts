import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class AddressDto {
  @IsNumber()
  customerId: number;

  @IsString()
  @IsNotEmpty()
  addressLine: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;
} 