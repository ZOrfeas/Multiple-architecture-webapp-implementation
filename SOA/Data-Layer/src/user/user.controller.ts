import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, ParseIntPipe, HttpCode, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserByEmailDto } from './dto/read-user-by-email.dto';
import { DuplicateKeyExceptionFilter } from '../duplicate-key-exception.filter';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new User in database' })
  @UseFilters(DuplicateKeyExceptionFilter)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Returns all existing Users' })
  findAll() {
    return this.userService.findAll();
  }

  @Get('count')
  @ApiOperation({ summary: 'Returns the total nr. of existing answers' })
  count() {
    return this.userService.count();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns a user by their id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates a user by their id' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Removes a user by their id' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Post('by-email')
  @HttpCode(200)
  @ApiOperation({ summary: 'Returns a user by their email' })
  findOneByEmail(@Body() userByEmailDto: UserByEmailDto) {
    return this.userService.findOneByEmail(userByEmailDto);
  }
}
