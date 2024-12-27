import { HttpException, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs'; // Import bcryptjs để hash mật khẩu
import { Prisma } from '@prisma/client';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateLogginDto } from './dto/create-loggin.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { info } from 'console';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); // Tạo salt với độ khó 10
    return await bcrypt.hash(password, salt); // Trả về mật khẩu đã mã hóa
  }
  async createAccount(createAccountDto: CreateAccountDto) {
    const {
      email,
      password,
      firstName,
      lastName,
      avatar,
      location,
      birthday,
      roleType,
    } = createAccountDto;
    const existingAccount = await this.prisma.account.findUnique({
      where: { email },
    });
    if (existingAccount) {
      throw new HttpException('Email already taken', 400);
    }
    // Băm mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email, // Lưu email vào User
        firstName, // Lưu firstName vào User
        lastName, // Lưu lastName vào User
        avatar, // Lưu avatar vào User (nếu có)
        location, // Lưu location vào User (nếu có)
        birthday, // Lưu birthday vào User (nếu có)
        roleType,
      },
    });
    const account = await this.prisma.account.create({
      data: {
        email, // Thêm email vào dữ liệu
        password: hashedPassword, // Lưu mật khẩu đã mã hóa
      },
      select: {
        id: true, // Chọn các trường muốn trả về
        email: true,
        createdDate: true,
        updatedDate: true,
        user: true,
      },
    });

    return account;
  }

  getAccounts() {
    return this.prisma.account.findMany({
      select: {
        id: true,
        email: true,
        createdDate: true,
        updatedDate: true,
        user: true, // Bao gồm thông tin từ bảng `User`
      },
    });
  }

  getAccountById(id: number) {
    return this.prisma.account.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        createdDate: true,
        updatedDate: true,
        user: true, // Bao gồm thông tin từ bảng `User`
      },
    });
  }

  async updateAccountById(id: number, data: Prisma.AccountUpdateInput) {
    const findAccount = await this.prisma.account.findUnique({ where: { id } });
    if (!findAccount) throw new HttpException('Account not found', 404);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    if (data.password) {
      return await this.prisma.account.update({
        where: { id },
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
        email: findAccount.email,
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

  async deleAccountById(id: number) {
    const findAccount = await this.getAccountById(id);
    if (!findAccount) throw new HttpException('Account not found', 404);
    await this.prisma.account.delete({ where: { id } });
    return `Account with ID ${id} successfully deleted`;
  }
}
