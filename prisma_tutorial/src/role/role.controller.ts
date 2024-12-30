import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  findAll() {
    return this.roleService.getRoles();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.roleService.getRoleById(id);
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }

  @Post()
  async createRole(@Body() createRole: CreateRoleDto) {
    return this.roleService.createRole(createRole);
  }
}
