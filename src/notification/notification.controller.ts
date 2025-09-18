import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Query,
  Req,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '@nestjs/passport';

interface IdsBodyDto {
  ids?: number[];
}

@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationController {
  constructor(private readonly svc: NotificationService) {}

  @Get()
  async list(
    @Req() req: any,
    @Query('afterId') afterId?: string,
    @Query('limit') limit?: string,
    @Query('unread') unread?: 'true' | 'false',
  ) {
    return this.svc.listForUser(req.user.id, {
      afterId: afterId ? Number(afterId) : undefined,
      limit: limit ? Number(limit) : undefined,
      unread: unread === undefined ? undefined : unread === 'true',
    });
  }

  @Get('unread-count')
  async unreadCount(@Req() req: any) {
    return this.svc.unreadCount(req.user.id);
  }

  @Patch('read')
  async markRead(@Req() req: any, @Body() body: IdsBodyDto) {
    if (!Array.isArray(body.ids)) {
      throw new BadRequestException('ids must be an array of numbers');
    }
    return this.svc.markRead(req.user.id, body.ids);
  }

  @Patch('unread')
  async markUnread(@Req() req: any, @Body() body: IdsBodyDto) {
    if (!Array.isArray(body.ids)) {
      throw new BadRequestException('ids must be an array of numbers');
    }
    return this.svc.markUnread(req.user.id, body.ids);
  }

  @Delete()
  async deleteMany(@Req() req: any, @Body() body: IdsBodyDto) {
    if (!Array.isArray(body.ids)) {
      throw new BadRequestException('ids must be an array of numbers');
    }
    return this.svc.deleteForUser(req.user.id, body.ids);
  }
}
