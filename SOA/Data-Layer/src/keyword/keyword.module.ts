import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { KeywordService } from './keyword.service';
import { KeywordController } from './keyword.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keyword } from './entities/keyword.entity';
import { getCustomLogger } from '../logger.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword])],
  exports: [TypeOrmModule],
  controllers: [KeywordController],
  providers: [KeywordService],
})
export class KeywordModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(getCustomLogger(KeywordController.name))
      .forRoutes('/keyword');
  }
}
