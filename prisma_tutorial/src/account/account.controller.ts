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
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UpdateLogginDto } from './dto/update-loggin.dto';
import { CreateLogginDto } from './dto/create-loggin.dto';
import { request } from 'http';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Post()
  @UsePipes(ValidationPipe)
  createAccount(@Body() CreateAccountDto: CreateAccountDto) {
    return this.accountService.createAccount(CreateAccountDto);
  }

  @Get()
  getAccounts() {
    return this.accountService.getAccounts();
  }
  @Get(':id')
  async getAccountById(@Param('id', ParseIntPipe) id: number) {
    const account = await this.accountService.getAccountById(id);
    if (!account) throw new HttpException('User not found', 404);
    return account;
  }
  @Patch(':id')
  @UsePipes(ValidationPipe)
  updateAccountById(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateAccountDto: UpdateAccountDto,
  ) {
    return this.accountService.updateAccountById(id, UpdateAccountDto);
  }
  @Delete(':id')
  deleAccountById(@Param('id', ParseIntPipe) id: number) {
    return this.accountService.deleAccountById(id);
  }
}
