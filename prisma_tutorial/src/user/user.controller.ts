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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  BadRequestException,
  MaxFileSizeValidator,
  StreamableFile,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isValidFilename, storage_file, storage_image } from './storage.config';
import { createAccountforUser } from './dto/create-accountforuser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFilesUploadDto } from 'src/files_upload/dto/create-files_upload.dto';
import { extname, resolve } from 'path';
import type { Response } from 'express';
import { createReadStream, existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,

    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
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

  @Post('ava/:id')
  @UseInterceptors(FileInterceptor('ava', { storage: storage_image }))
  uploadAva(
    @Body() body: CreateFilesUploadDto,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000 * 1000 * 5 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No ava uploaded.');
    }
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
    const extensionRegex = new RegExp(
      `\\.(${validExtensions.join('|')})$`,
      'i',
    );
    if (!extensionRegex.test(file.originalname)) {
      throw new BadRequestException('Invalid format file.');
    }
    if (!isValidFilename(file.originalname)) {
      throw new BadRequestException('Invalid file name.');
    }

    const fileExtension = extname(file.originalname).slice(1); // Lấy phần mở rộng, bỏ đi dấu '.'

    return this.userService.uploadava(id, file.path, file.size, fileExtension);
  }

  @Post('file/:id')
  @UseInterceptors(FileInterceptor('file', { storage: storage_file }))
  uploadFile(
    @Body() body: CreateFilesUploadDto,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1000 * 1000 * 5 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }
    const validExtensions = ['pdf', 'docx', 'xlsx', 'rtf', 'bin', 'mp4'];
    const extensionRegex = new RegExp(
      `\\.(${validExtensions.join('|')})$`,
      'i',
    );
    if (!extensionRegex.test(file.originalname)) {
      throw new BadRequestException('Invalid format file.');
    }
    if (!isValidFilename(file.originalname)) {
      unlinkSync(file.path);
      throw new BadRequestException('Invalid file name.');
    }

    const fileExtension = extname(file.originalname).slice(1); // Lấy phần mở rộng, bỏ đi dấu '.'

    return this.userService.uploadfile(id, file.path, file.size, fileExtension);
  }

  @Get('download/:filename') // Thêm :filename vào route
  async getFileByName(
    @Param('filename') filename: string, // Không sử dụng ParseIntPipe
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const filePath = join(process.cwd(), 'uploads_file', filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    // Kiểm tra và quản lý số lượng người dùng tải file

    const file = createReadStream(filePath);
    res.set({
      'Content-Type': 'application/rtf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    return new StreamableFile(file);
  }

  async delay(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  @Post('testtime')
  async timeoutTest(): Promise<string> {
    await this.delay(10000);
    return 'OK';
  }
}
