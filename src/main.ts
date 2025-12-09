import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for your frontend
  app.enableCors({
    origin: [
      'https://www.merab.in',
      'https://merab.in',
      'https://www.merab.design',
      'https://merab.design',
      'http://localhost:5173',
      'http://localhost:3000',
    ],
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    credentials: true,
  });

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Meraab Backend API')
    .setDescription('API documentation for Meraab backend')
    .setVersion('1.0')
    .addBearerAuth() // Adds JWT support (if needed later)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
