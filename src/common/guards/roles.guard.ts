import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    let requiredRoles = this.reflector.getAllAndOverride<string | string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 체크된 권한이 배열이 아닌 경우 무조건 true 반환
    if (!requiredRoles) {
      return true;
    }

    // user.roles도 배열 형식인지 확인
    const { user } = context.switchToHttp().getRequest();

    // user.roles가 배열이 아닌 경우 예외 발생
    if (!Array.isArray(user.roles)) {
      throw new ForbiddenException('You do not have permission.');
    }

    // includes 메서드 사용하여 역할 확인
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.some(role => user.roles.includes(role));
    }

    return false;  // fallback if needed
  }
}
