import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { OrderDto } from '../dto/order.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

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
  async create(@Body() orderData: OrderDto) {
    const order = await this.orderService.createOrder(orderData);
    return { status: 201, order };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os pedidos' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de pedidos retornada com sucesso',
    type: [OrderDto]
  })
  async getAll() {
    const orders = await this.orderService.getAllOrders();
    return { status: 200, orders };
  }

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
    status: 404, 
    description: 'Pedido não encontrado'
  })
  async update(@Param('id') id: string, @Body() orderData: OrderDto) {
    const updatedOrder = await this.orderService.updateOrder(+id, orderData);
    return { status: 200, updatedOrder };
  }
} 