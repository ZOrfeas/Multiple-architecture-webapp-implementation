import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, ParseIntPipe } from '@nestjs/common';
import { KeywordService } from './keyword.service';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('keyword')
@ApiTags('Keyword')
export class KeywordController {
  private readonly logger = new Logger(KeywordController.name);

  constructor(private readonly keywordService: KeywordService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new Keyword in database' })
  create(@Body() createKeywordDto: CreateKeywordDto) {
    return this.keywordService.create(createKeywordDto);
  }

  @Get()
  @ApiOperation({ summary: 'Returns all existing Keywords' })
  findAll() {
    return this.keywordService.findAll();
  }

  @Get('count')
  @ApiOperation({ summary: 'Returns the total nr. of existing keywords ' })
  count() {
    return this.keywordService.count();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retruns a keyword by its id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.keywordService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates a keyword by its id' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateKeywordDto: UpdateKeywordDto,
  ) {
    return this.keywordService.update(id, updateKeywordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a keyword by its id' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.keywordService.remove(id);
  }
}
