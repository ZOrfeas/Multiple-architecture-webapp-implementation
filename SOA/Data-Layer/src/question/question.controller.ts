import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, ParseIntPipe, Query, ParseArrayPipe, BadRequestException } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PaginateUtils } from '../pagination';
import { ApiOperation } from '@nestjs/swagger';

@Controller('question')
export class QuestionController {
  private readonly logger = new Logger(QuestionController.name);

  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new Question in database' })
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Returns all existing Questions' })
  findAll() {
    return this.questionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns a question by its id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates a question by its id' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a question by its id' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.questionService.remove(id);
  }

  @Get('by/keyword')
  @ApiOperation({
    summary: 'Returns all questions containing the specified keywords',
  })
  findByKeyword(
    @Query('id', new ParseArrayPipe({ items: Number, separator: ',' }))
    ids: number[],
    @Query()
    pageInfo: PaginateUtils, // also undefined
  ) {
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
