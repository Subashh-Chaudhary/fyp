import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  findAll() {
    return 'findAll';
  }

  @Post('user/login')
  login(@Body() body: any) {
    return `login: ${JSON.stringify(body)}`;
  }

  @Post('user/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.register(createUserDto);
    return { data: user, message: 'User created successfully' };
  }

  @Get('user/:id')
  findOne(@Param('id') id: string) {
    return `findOne: ${id}`;
  }

  @Patch('user/:id')
  update(@Param('id') id: string, @Body() body: any) {
    return `update: ${id} ${JSON.stringify(body)}`;
  }

  @Delete('user/:id')
  delete(@Param('id') id: string) {
    return `delete: ${id}`;
  }
}
