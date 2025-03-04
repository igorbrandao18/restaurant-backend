import { AddressService } from './address.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const addressService = new AddressService();

describe('AddressService', () => {
  it('should create an address', async () => {
    const addressData = {
      customerId: 1,
      addressLine: '123 Main St',
      city: 'Test City',
      postalCode: '12345'
    };
    const address = await addressService.createAddress(addressData);
    expect(address).toHaveProperty('id');
  });

  it('should get all addresses', async () => {
    const addresses = await addressService.getAllAddresses();
    expect(Array.isArray(addresses)).toBe(true);
  });

  it('should update an address', async () => {
    const addressData = {
      customerId: 1,
      addressLine: '123 Main St',
      city: 'Test City',
      postalCode: '12345'
    };
    const address = await addressService.createAddress(addressData);
    const updatedAddress = await addressService.updateAddress(address.id, {
      ...addressData,
      addressLine: '456 New St'
    });
    expect(updatedAddress.addressLine).toBe('456 New St');
  });
}); 