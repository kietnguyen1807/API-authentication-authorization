import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLogginDto } from './dto/create-login.dto';
import * as bcrypt from 'bcryptjs'; // Import bcryptjs để hash mật khẩu
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signIn(createLoggin: CreateLogginDto) {
    const { email, password } = createLoggin;
    const existingAccount = await this.prisma.account.findUnique({
      where: { email },
    });
    if (!existingAccount) {
      throw new HttpException('Email not registered', 400);
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingAccount.password,
    );
    if (!isPasswordCorrect) {
      throw new HttpException('Password not correct', 400);
    }
    const infor = await this.prisma.account.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        createdDate: true,
        updatedDate: true,
        user: true,
      },
    });
    const payload = {
      ...infor,
    };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      infor,
      access_token,
    };
  }

  async updateProfile(token: string, data: Prisma.AccountUpdateInput) {
    const decoded = (await this.jwtService.decode(token)) as any;
    const email = decoded?.email;
    const findaccount = await this.prisma.account.findUnique({
      where: { email },
    });
    const hashedPassword = await bcrypt.hash(data.password, 10);
    if (data.password) {
      return await this.prisma.account.update({
        where: { email },
        data: {
          password: hashedPassword,
        },
        select: {
          id: true, // Chọn các trường muốn trả về
          email: true,
          createdDate: true,
          updatedDate: true,
          user: true,
        },
      });
    }
    const user = await this.prisma.user.update({
      where: {
        email: findaccount.email,
      },
      data,
      include: {
        Account: {
          select: {
            id: true,
            createdDate: true,
            updatedDate: true,
            email: true,
          },
        },
      },
    });
    return user;
  }
}
