import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { AddressService } from '../services/address.service';
import { AddressDto } from '../dto/address.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('addresses')
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo endereço' })
  @ApiResponse({ 
    status: 201, 
    description: 'Endereço criado com sucesso',
    type: AddressDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos'
  })
  async create(@Body() addressData: AddressDto) {
    const address = await this.addressService.createAddress(addressData);
    return { status: 201, address };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os endereços' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de endereços retornada com sucesso',
    type: [AddressDto]
  })
  async getAll() {
    const addresses = await this.addressService.getAllAddresses();
    return { status: 200, addresses };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um endereço existente' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do endereço a ser atualizado',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Endereço atualizado com sucesso',
    type: AddressDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Endereço não encontrado'
  })
  async update(@Param('id') id: string, @Body() addressData: AddressDto) {
    const updatedAddress = await this.addressService.updateAddress(+id, addressData);
    return { status: 200, updatedAddress };
  }
} 