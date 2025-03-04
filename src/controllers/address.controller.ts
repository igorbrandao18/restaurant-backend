import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { AddressService } from '../services/address.service';
import { AddressDto } from '../dto/address.dto';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(@Body() addressData: AddressDto) {
    const address = await this.addressService.createAddress(addressData);
    return { status: 201, address };
  }

  @Get()
  async getAll() {
    const addresses = await this.addressService.getAllAddresses();
    return { status: 200, addresses };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() addressData: AddressDto) {
    const updatedAddress = await this.addressService.updateAddress(+id, addressData);
    return { status: 200, updatedAddress };
  }
} 