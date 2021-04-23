import { Module } from '@nestjs/common';
import { KeywordService } from './keyword.service';
import { KeywordController } from './keyword.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keyword } from './entities/keyword.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword])],
  exports: [TypeOrmModule],
  controllers: [KeywordController],
  providers: [KeywordService],
})
export class KeywordModule {}
