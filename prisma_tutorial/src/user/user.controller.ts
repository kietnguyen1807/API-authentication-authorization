import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  HttpException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { createAccountforUser } from './dto/create-accountforuser.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUserById(id);
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUserById(id, UpdateUserDto);
  }

  @Delete(':id')
  deleUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleUserById(id);
  }

  @Post('account/:id')
  @UsePipes(ValidationPipe)
  createAccountforUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() createAccountforUser: createAccountforUser,
  ) {
    return this.userService.createAccountforUser(id, createAccountforUser);
  }
}
