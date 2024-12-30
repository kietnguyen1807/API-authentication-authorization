import { HttpException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}
  getRoles() {
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
  getRoleById(id: number) {
    return this.prisma.roles.findUnique({
      where: { id },
      include: { user: true },
    });
  }
  createRole(createRole: CreateRoleDto) {
    return this.prisma.roles.create({
      data: {
        type_role: createRole.roleType,
      },
    });
  }
  updateRole(id: number, data: Prisma.RolesUpdateInput) {
    return this.prisma.roles.update({ where: { id }, data });
  }
}
