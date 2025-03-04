import { Controller, Post, Get, Put, Body, Param, UseGuards, Request, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { OrderDto } from '../dto/order.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../services/jwt-auth.guard';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar um novo pedido' })
  @ApiResponse({ 
    status: 201, 
    description: 'Pedido criado com sucesso',
    type: OrderDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado'
  })
  async create(@Request() req, @Body() orderData: OrderDto) {
    if (!req.user || !req.user.restaurantId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    
    orderData.restaurantId = req.user.restaurantId;
    const order = await this.orderService.createOrder(orderData);
    return { status: 201, order };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Listar todos os pedidos do restaurante autenticado' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de pedidos retornada com sucesso',
    type: [OrderDto]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado'
  })
  async getAll(@Request() req) {
    if (!req.user || !req.user.restaurantId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    
    const orders = await this.orderService.getAllOrders();
    const restaurantOrders = orders.filter(order => order.restaurantId === req.user.restaurantId);
    return { status: 200, orders: restaurantOrders };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um pedido existente' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do pedido a ser atualizado',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Pedido atualizado com sucesso',
    type: OrderDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acesso negado'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Pedido não encontrado'
  })
  async update(@Request() req, @Param('id') id: string, @Body() orderData: OrderDto) {
    if (!req.user || !req.user.restaurantId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const existingOrder = await this.orderService.getOrderById(+id);
    if (!existingOrder) {
      throw new ForbiddenException('Pedido não encontrado');
    }

    if (existingOrder.restaurantId !== req.user.restaurantId) {
      throw new ForbiddenException('Você não tem permissão para atualizar este pedido');
    }
    
    orderData.restaurantId = req.user.restaurantId;
    const updatedOrder = await this.orderService.updateOrder(+id, orderData);
    return { status: 200, order: updatedOrder };
  }
} 