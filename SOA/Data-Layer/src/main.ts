import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const apiConfig = new DocumentBuilder()
    .setTitle('Docs')
    .setDescription('DataLayer Capabilities')
    .build();
  const document = SwaggerModule.createDocument(app, apiConfig);
  SwaggerModule.setup('spec', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });
  await app.listen(3000);
}
bootstrap();
