import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from './address.controller';
import { AddressService } from '../services/address.service';
import { AddressDto } from '../dto/address.dto';

describe('AddressController', () => {
  let addressController: AddressController;
  let addressService: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [AddressService],
    }).compile();

    addressController = module.get<AddressController>(AddressController);
    addressService = module.get<AddressService>(AddressService);
  });

  it('should create an address', async () => {
    const addressData: AddressDto = {
      customerId: 1,
      addressLine: '123 Main St',
      city: 'Test City',
      postalCode: '12345'
    };
    jest.spyOn(addressService, 'createAddress').mockResolvedValue({ id: 1, ...addressData });
    const result = await addressController.create(addressData);
    expect(result).toEqual({ status: 201, address: { id: 1, ...addressData } });
  });

  it('should get all addresses', async () => {
    jest.spyOn(addressService, 'getAllAddresses').mockResolvedValue([]);
    const result = await addressController.getAll();
    expect(result).toEqual({ status: 200, addresses: [] });
  });

  it('should update an address', async () => {
    const addressData: AddressDto = {
      customerId: 1,
      addressLine: '456 New St',
      city: 'Test City',
      postalCode: '12345'
    };
    jest.spyOn(addressService, 'updateAddress').mockResolvedValue({ id: 1, ...addressData });
    const result = await addressController.update('1', addressData);
    expect(result).toEqual({ status: 200, updatedAddress: { id: 1, ...addressData } });
  });
}); 