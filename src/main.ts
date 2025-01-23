import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { ResponseInterceptor } from './common/filters/response.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestjsRedoxModule } from 'nestjs-redox'

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'], // 추가된 Authorization 헤더
    credentials: true,
  });


  const config = new DocumentBuilder()
    .setTitle('API 문서')
    .setDescription('API 관련 설명')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  await SwaggerModule.setup('docs', app, document)

  await NestjsRedoxModule.setup('redoc', app, document, {
    standalone: true,
  });


  app.useGlobalPipes(new ValidationPipe({
    transform: true, // DTO에 정의된 타입으로 변환
    whitelist: true, // DTO에 없는 값은 무시
  }),);
  
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(3000);
}
bootstrap();
