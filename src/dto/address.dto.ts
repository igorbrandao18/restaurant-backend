import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty({
    description: 'ID do cliente ao qual o endereço pertence',
    example: 1
  })
  @IsNumber()
  customerId: number;

  @ApiProperty({
    description: 'Endereço completo (rua, número, complemento)',
    example: 'Rua das Flores, 123, Apto 101'
  })
  @IsString()
  addressLine: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'Bauru'
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'CEP',
    example: '17012-360'
  })
  @IsString()
  postalCode: string;
} 