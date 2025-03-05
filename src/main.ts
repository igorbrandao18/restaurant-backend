import { config } from 'dotenv';
config(); // Load environment variables from .env file

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Restaurant API')
    .setDescription('API para gerenciamento de restaurantes, menus e pedidos')
    .setVersion('1.0')
    .addTag('restaurants', 'Operações relacionadas a restaurantes')
    .addTag('menus', 'Operações relacionadas a menus')
    .addTag('orders', 'Operações relacionadas a pedidos')
    .addTag('addresses', 'Operações relacionadas a endereços')
    .addTag('auth', 'Operações relacionadas a autenticação')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3001);
}
bootstrap();
