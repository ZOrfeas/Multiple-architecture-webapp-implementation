import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Controller('answer')
@ApiTags('Answer')
export class AnswerController {
  private readonly logger = new Logger(AnswerController.name);

  constructor(private readonly answerService: AnswerService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new Answer in database' })
  create(@Body() createAnswerDto: CreateAnswerDto) {
    return this.answerService.create(createAnswerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Returns all existing Answers' })
  findAll() {
    return this.answerService.findAll();
  }

  @Get('count')
  @ApiOperation({ summary: 'Returns the total nr. of existing answers' })
  count() {
    return this.answerService.count();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returs an answer by its id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.answerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates an answer by its id' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ) {
    return this.answerService.update(id, updateAnswerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes an answer by its id' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.answerService.remove(id);
  }
}
