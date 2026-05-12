import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { validateEnv } from './config/env.config';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  // Validate environment variables first to fail fast
  validateEnv(process.env);

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Security
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: [
      process.env.APP_URL,
      'http://localhost:3000',
      'http://localhost:3005',
    ].filter(Boolean) as string[],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global Error Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger API docs
  const config = new DocumentBuilder()
    .setTitle('PortfolioAI API')
    .setDescription('AI-powered portfolio builder and career intelligence API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4005;
  await app.listen(port);
  console.log(`🚀 PortfolioAI API running on http://localhost:${port}`);
  console.log(`📚 API Docs: http://localhost:${port}/api/docs`);
}

bootstrap();
