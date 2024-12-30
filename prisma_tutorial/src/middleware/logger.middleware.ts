// import {
//   ExecutionContext,
//   Injectable,
//   NestMiddleware,
//   UnauthorizedException,
//   UseGuards,
// } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { AuthGuard } from 'src/auth/auth.guard';

// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
//   constructor(private readonly authGuard: AuthGuard) {}
//   async use(req: Request, res: Response, next: NextFunction) {
//     const context = {
//       switchToHttp: () => ({ getRequest: () => req }),
//     } as ExecutionContext;
//     try {
//       // Gọi guard để xác thực token
//       await this.authGuard.canActivate(context);
//       console.log('from middleware - AuthGuard passed');
//       next();
//     } catch (error) {
//       console.log('from middleware - AuthGuard failed');
//       throw new UnauthorizedException();
//     }
//   }
// }
