import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class RequestUserGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const userId = request.headers['x-user-id']
    if (!userId) throw new UnauthorizedException('Missing x-user-id header')
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new UnauthorizedException('Invalid user')
    request.user = user
    return true
  }
}
