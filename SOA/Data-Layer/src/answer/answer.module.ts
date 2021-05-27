import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { getCustomLogger } from '../logger.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Answer])],
  exports: [TypeOrmModule],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(getCustomLogger(AnswerController.name)).forRoutes('/answer');
  }
}
