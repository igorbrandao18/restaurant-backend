import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from '../../../src/controllers/address.controller';
import { AddressService } from '../../../src/services/address.service';
import { AddressDto } from '../../../src/dto/address.dto';

describe('AddressController', () => {
  let controller: AddressController;
  let service: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        {
          provide: AddressService,
          useValue: {
            createAddress: jest.fn(),
            getAllAddresses: jest.fn(),
            updateAddress: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AddressController>(AddressController);
    service = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an address', async () => {
      const addressDto: AddressDto = {
        customerId: 1,
        addressLine: '123 Test St',
        city: 'Test City',
        postalCode: '12345'
      };

      const expectedResult = {
        id: 1,
        ...addressDto
      };

      jest.spyOn(service, 'createAddress').mockResolvedValue(expectedResult);

      const result = await controller.create(addressDto);
      expect(result).toEqual({ status: 201, address: expectedResult });
    });
  });

  describe('getAll', () => {
    it('should return an array of addresses', async () => {
      const expectedResult = [
        {
          id: 1,
          customerId: 1,
          addressLine: '123 Test St',
          city: 'Test City',
          postalCode: '12345'
        },
        {
          id: 2,
          customerId: 2,
          addressLine: '456 Test Ave',
          city: 'Test City',
          postalCode: '67890'
        },
      ];

      jest.spyOn(service, 'getAllAddresses').mockResolvedValue(expectedResult);

      const result = await controller.getAll();
      expect(result).toEqual({ status: 200, addresses: expectedResult });
    });
  });

  describe('update', () => {
    it('should update an address', async () => {
      const id = '1';
      const updateDto: AddressDto = {
        customerId: 1,
        addressLine: '456 Update St',
        city: 'Update City',
        postalCode: '54321'
      };

      const expectedResult = {
        id: parseInt(id),
        ...updateDto
      };

      jest.spyOn(service, 'updateAddress').mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateDto);
      expect(result).toEqual({ status: 200, updatedAddress: expectedResult });
    });
  });
}); 