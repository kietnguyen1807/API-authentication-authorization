import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
// import { LoggerMiddleware } from './middleware/logger.middleware';
import { AuthGuard } from './auth/auth.guard';
import { Prisma } from '@prisma/client';
import { PrismaModule } from './prisma/prisma.module';
import { AccountController } from './account/account.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleModule } from './role/role.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Transport } from '@nestjs/microservices';

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
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
