import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

import * as bcrypt from 'bcryptjs'; // Import bcryptjs để hash mật khẩu
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); // Tạo salt với độ khó 10
    return await bcrypt.hash(password, salt); // Trả về mật khẩu đã mã hóa
  }

  async createUser(createUserDto: CreateUserDto) {
    const { password, email, ...data } = createUserDto;
    const role = await this.prisma.roles.findUnique({
      where: { type_role: data.roleType },
    });
    if (!role) {
      throw new HttpException('Role not exist', 404);
    }
    const emialexist = await this.prisma.user.findUnique({ where: { email } });
    if (emialexist) {
      throw new HttpException('Email already exist', 404);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        ...data, // Các thông tin khác từ CreateUserDto
        email,
        Account: {
          create: {
            password: hashedPassword,
          },
        },
      },
      include: {
        Account: {
          select: {
            id: true,
            email: true,
            createdDate: true,
            updatedDate: true,
          },
        }, // Bao gồm Account khi trả về kết quả
      },
    });
  }
  getUsers() {
    return this.prisma.user.findMany({
      include: {
        Account: {
          select: {
            id: true,
            email: true,
            createdDate: true,
            updatedDate: true,
          },
        },
      },
    });
  }
  getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        Account: {
          select: {
            id: true,
            email: true,
            createdDate: true,
            updatedDate: true,
          },
        },
      },
    });
  }

  async deleUserById(id: number) {
    const findUser = await this.getUserById(id);
    if (!findUser) throw new HttpException('User not found', 404);
    await this.prisma.user.delete({ where: { id } });
    return `User with ID ${id} successfully deleted`;
  }
  async updateUserById(id: number, data: Prisma.UserUpdateInput) {
    const findUser = await this.getUserById(id);
    if (!findUser) throw new HttpException('User not found', 404);
    if (data.email) {
      const findUser = await this.prisma.user.findUnique({
        where: { email: data.email as string },
      });
      if (findUser) throw new HttpException('Email already exist', 400);
    }
    const newaccount = await this.prisma.account.findUnique({
      where: { email: findUser.email },
    });
    if (
      data.firstName ||
      data.lastName ||
      data.middleName ||
      data.avatar ||
      data.location ||
      data.birthday ||
      data.email
    ) {
      return this.prisma.user.update({
        where: { id },
        data,
        include: {
          Account: {
            select: {
              id: true,
              email: true,
              createdDate: true,
              updatedDate: true,
            },
          },
        },
      });
    }
    const hashedPassword = await bcrypt.hash(newaccount.password, 10);
    return this.prisma.account.update({
      where: { email: findUser.email },
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
  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      include: {
        Account: {
          select: {
            id: true,
            email: true,
            createdDate: true,
            updatedDate: true,
          },
        },
      },
    });
  }

  getUserBytoken(authenToken: string) {
    const [headerBase64, payloadBase64, signatureBase64] =
      authenToken.split('.');
    if (!payloadBase64) throw new HttpException('Error token', 404);
  }
}
