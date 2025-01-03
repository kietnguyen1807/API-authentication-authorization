import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { RoleModule } from './role/role.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FilesUploadModule } from './files_upload/files_upload.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TimeoutInterceptor } from './interceptor/timeout.interceptor';
@Module({
  imports: [
    UserModule,
    AccountModule,
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '99999999999999y' },
    }),
    RoleModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (ConfigService: ConfigService) => ({
        store: redisStore,
        host: ConfigService.get<string>('REDIS_HOST'),
        port: ConfigService.get<number>('REDIS_PORT'),
      }),
    }),
    FilesUploadModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    AuthService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: GetRequestInterceptor,
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class AppModule {}
