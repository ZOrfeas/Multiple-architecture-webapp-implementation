import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, ParseIntPipe, Query, ParseArrayPipe, BadRequestException } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PaginateUtils } from '../pagination';

@Controller('question')
export class QuestionController {
  private readonly logger = new Logger(QuestionController.name);

  constructor(private readonly questionService: QuestionService) {}

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  @Get()
  findAll() {
    return this.questionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.questionService.remove(id);
  }

  @Get('by/keyword')
  findByKeyword(
    @Query('id', new ParseArrayPipe({ items: Number, separator: ',' }))
    ids: number[],
    @Query()
    pageInfo: PaginateUtils, // also undefined
  ) {
    // this.logger.debug(ids);
    // this.logger.debug(pageInfo);
    // this.logger.debug(pageInfo.pagesize);
    // this.logger.debug(+pageInfo.pagenr);
    // this.logger.error(typeof pageInfo.pagenr);
    if (
      typeof pageInfo.pagenr === 'undefined' &&
      typeof pageInfo.pagesize === 'undefined'
    ) {
      return this.questionService.findByKeyword(ids);
    } else if (
      typeof pageInfo.pagenr === 'undefined' ||
      typeof pageInfo.pagesize === 'undefined'
    ) {
      throw new BadRequestException(
        'Please specify both or neither of pagesize and pagenr params',
      );
    } else {
      return this.questionService.findByKeyword(
        ids,
        +pageInfo.pagesize,
        +pageInfo.pagenr,
      );
    }
  }
}
