import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty({
    description: 'ID do cliente ao qual o endereço pertence',
    example: 1
  })
  @IsNumber()
  customerId: number;

  @ApiProperty({
    description: 'Linha de endereço (rua, número, complemento)',
    example: 'Rua das Flores, 123, Apto 101'
  })
  @IsString()
  @IsNotEmpty()
  addressLine: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'Bauru'
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'CEP',
    example: '17012-360'
  })
  @IsString()
  @IsNotEmpty()
  postalCode: string;
} 