import { Module } from '@nestjs/common';
import { RestaurantController } from './controllers/restaurant.controller';
import { RestaurantService } from './services/restaurant.service';
import { MenuController } from './controllers/menu.controller';
import { MenuService } from './services/menu.service';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { AddressController } from './controllers/address.controller';
import { AddressService } from './services/address.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [],
  controllers: [RestaurantController, MenuController, OrderController, AddressController, AuthController],
  providers: [RestaurantService, MenuService, OrderService, AddressService, AuthService],
})
export class AppModule {}
