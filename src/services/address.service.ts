import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AddressDto } from '../dto/address.dto';

const prisma = new PrismaClient();

@Injectable()
export class AddressService {
  async createAddress(data: AddressDto) {
    return await prisma.address.create({ data });
  }

  async getAllAddresses() {
    return await prisma.address.findMany();
  }

  async updateAddress(id: number, data: AddressDto) {
    return await prisma.address.update({
      where: { id },
      data,
    });
  }
} 