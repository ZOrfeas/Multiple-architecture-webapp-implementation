import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { getCustomLogger } from '../logger.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  exports: [TypeOrmModule],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(getCustomLogger(QuestionController.name))
      .forRoutes(QuestionController);
  }
}
