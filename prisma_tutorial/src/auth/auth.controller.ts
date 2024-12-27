import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { CreateLogginDto } from './dto/create-login.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UpdateAccountDto } from 'src/account/dto/update-account.dto';
import { Public } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  @UsePipes(ValidationPipe)
  signIn(@Body() CreateLoginDto: CreateLogginDto) {
    return this.authService.signIn(CreateLoginDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @Patch('profile')
  updateProfile(@Request() req, @Body() UpdateAccountDto: UpdateAccountDto) {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    return this.authService.updateProfile(token, UpdateAccountDto);
  }
}
