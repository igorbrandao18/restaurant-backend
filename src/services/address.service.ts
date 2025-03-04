import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddressDto } from '../dto/address.dto';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async createAddress(data: AddressDto) {
    return await this.prisma.address.create({ data });
  }

  async getAllAddresses() {
    return await this.prisma.address.findMany();
  }

  async updateAddress(id: number, data: AddressDto) {
    return await this.prisma.address.update({
      where: { id },
      data,
    });
  }
} 