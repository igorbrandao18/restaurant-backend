import { validate } from 'class-validator';
import { RestaurantDto } from '../../src/dto/restaurant.dto';
import { OrderDto } from '../../src/dto/order.dto';
import { AddressDto } from '../../src/dto/address.dto';
import { AuthDto } from '../../src/dto/auth.dto';

describe('DTO Validations', () => {
  describe('RestaurantDto', () => {
    it('should validate a valid restaurant DTO', async () => {
      const dto = new RestaurantDto();
      dto.name = 'Test Restaurant';
      dto.address = 'Test Address';
      dto.city = 'Test City';
      dto.country = 'Test Country';
      dto.username = 'testrestaurant';
      dto.password = 'testpassword';
      dto.webSettings = {
        primaryColor: '#000000',
        secondaryColor: '#FFFFFF',
      };

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with missing required fields', async () => {
      const dto = new RestaurantDto();
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('OrderDto', () => {
    it('should validate a valid order DTO', async () => {
      const dto = new OrderDto();
      dto.restaurantId = 1;
      dto.customerId = 1;
      dto.items = {
        items: [
          {
            menuId: 1,
            quantity: 2,
            price: 10.99,
            notes: 'No onions',
          },
        ],
      };
      dto.total = 21.98;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid total', async () => {
      const dto = new OrderDto();
      dto.restaurantId = 1;
      dto.customerId = 1;
      dto.items = {
        items: [
          {
            menuId: 1,
            quantity: 2,
            price: 10.99,
            notes: 'No onions',
          },
        ],
      };
      dto.total = -10; // Invalid negative total

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('AddressDto', () => {
    it('should validate a valid address DTO', async () => {
      const dto = new AddressDto();
      dto.customerId = 1;
      dto.addressLine = 'Rua das Flores, 123';
      dto.city = 'São Paulo';
      dto.postalCode = '01234-567';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid postal code format', async () => {
      const dto = new AddressDto();
      dto.customerId = 1;
      dto.addressLine = 'Rua das Flores, 123';
      dto.city = 'São Paulo';
      dto.postalCode = '123'; // Invalid postal code format

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('AuthDto', () => {
    it('should validate a valid auth DTO', async () => {
      const dto = new AuthDto();
      dto.username = 'testuser';
      dto.password = 'testpassword';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty credentials', async () => {
      const dto = new AuthDto();
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
}); 