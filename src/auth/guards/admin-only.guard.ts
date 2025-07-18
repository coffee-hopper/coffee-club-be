import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AdminOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user || user.role !== 'admin') {
      throw new ForbiddenException(
        'You must be an admin to perform this action',
      );
    }

    return true;
  }
}
