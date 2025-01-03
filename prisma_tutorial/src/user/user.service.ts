import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs'; // Import bcryptjs để hash mật khẩu
import { createAccountforUser } from './dto/create-accountforuser.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); // Tạo salt với độ khó 10
    return await bcrypt.hash(password, salt); // Trả về mật khẩu đã mã hóa
  }
  async createAccountforUser(id: number, createUserDto: createAccountforUser) {
    const { password } = createUserDto;
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user.id) {
      throw new HttpException('User not found', 404);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.account.create({
      data: {
        email: user.email,
        password: hashedPassword,
      },
    });
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
        files: true,
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
        files: true,
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

  async uploadava(id, avapath, sizepath, typepath) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return this.prisma.files.create({
      data: {
        avatar: avapath,
        size_image: sizepath,
        type_image: typepath,
        userId: id,
      },
    });
  }

  async uploadfile(id, filepath, sizepath, typepath) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return this.prisma.files.create({
      data: {
        file: filepath,
        size_file: sizepath,
        type_file: typepath,
        userId: id,
      },
    });
  }
}
