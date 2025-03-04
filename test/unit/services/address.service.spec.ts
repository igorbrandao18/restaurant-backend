import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from '../../../src/services/address.service';
import { PrismaService } from '../../../src/prisma/prisma.service';

describe('AddressService', () => {
  let service: AddressService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: PrismaService,
          useValue: {
            address: {
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAddress', () => {
    it('should create an address', async () => {
      const addressData = {
        customerId: 1,
        addressLine: '123 Main St, Apt 4B, Downtown',
        city: 'Test City',
        postalCode: '12345'
      };

      const mockAddress = {
        id: 1,
        ...addressData
      };

      jest.spyOn(prismaService.address, 'create').mockResolvedValue(mockAddress);

      const result = await service.createAddress(addressData);
      expect(result).toEqual(mockAddress);
    });
  });

  describe('getAllAddresses', () => {
    it('should return an array of addresses', async () => {
      const mockAddresses = [
        {
          id: 1,
          customerId: 1,
          addressLine: '123 Main St, Apt 4B, Downtown',
          city: 'Test City',
          postalCode: '12345'
        },
        {
          id: 2,
          customerId: 2,
          addressLine: '456 Oak St, Suite 7, Uptown',
          city: 'Test City',
          postalCode: '67890'
        }
      ];

      jest.spyOn(prismaService.address, 'findMany').mockResolvedValue(mockAddresses);

      const result = await service.getAllAddresses();
      expect(result).toEqual(mockAddresses);
    });
  });

  describe('updateAddress', () => {
    it('should update an address', async () => {
      const id = 1;
      const updateData = {
        customerId: 1,
        addressLine: '456 New St, Apt 8C, Midtown',
        city: 'Updated City',
        postalCode: '54321'
      };

      const mockUpdatedAddress = {
        id,
        ...updateData
      };

      jest.spyOn(prismaService.address, 'update').mockResolvedValue(mockUpdatedAddress);

      const result = await service.updateAddress(id, updateData);
      expect(result).toEqual(mockUpdatedAddress);
    });
  });
}); 