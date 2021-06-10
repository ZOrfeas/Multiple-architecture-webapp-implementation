import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, ParseIntPipe, Query, ParseArrayPipe, BadRequestException } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { paginateOrNot, PaginateUtils } from '../pagination';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('question')
@ApiTags('Question')
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

  @Get('count')
  @ApiOperation({ summary: 'Returns the total nr. of existing questions' })
  count() {
    return this.questionService.count();
  }

  @Get('browse')
  @ApiOperation({ summary: 'Returns a page of sorted questions with info' })
  browse(
    @Query()
    pageInfo: PaginateUtils, // also undefined
  ) {
    return paginateOrNot(
      pageInfo,
      () => this.questionService.getPage(+pageInfo.pagesize, +pageInfo.pagenr),
      () => {
        throw new BadRequestException(
          'Too much data requested, specify pagesize and pagenr',
        );
      },
    );
  }

  @Get('info')
  @ApiOperation({ summary: 'Returns all details on a question ' })
  getInfo(@Query('id', ParseIntPipe) id: number) {
    return this.questionService.getInfo(id);
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
  @ApiQuery({ name: 'pagenr', description: 'page number requested' })
  @ApiQuery({ name: 'pagesize', description: 'the size of the page' })
  findByKeyword(
    @Query('id', new ParseArrayPipe({ items: Number, separator: ',' }))
    ids: number[],
    @Query()
    pageInfo: PaginateUtils, // also undefined
  ) {
    return paginateOrNot(
      pageInfo,
      () =>
        this.questionService.findByKeyword(
          ids,
          +pageInfo.pagesize,
          +pageInfo.pagenr,
        ),
      () => this.questionService.findByKeyword(ids),
    );
  }

  @Get('count/by/keyword')
  @ApiOperation({
    summary: 'Returns the count of questions containing the specified keywords',
  })
  countByKeyword(
    @Query('id', new ParseArrayPipe({ items: Number, separator: ',' }))
    ids: number[],
  ) {
    return this.questionService.countByKeyword(ids);
  }

  @Get('count/by/year')
  @ApiOperation({
    summary: 'Returns the count of questions submitted by day for a given year',
  })
  countByYear(
    @Query('year', ParseIntPipe)
    year: number,
  ) {
    return this.questionService.countByYear(year);
  }
}
