import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    // In a real application, 'user' would have a 'roles' array or similar property
    // For this example, let's assume a 'role' string property on the User document
    // You would need to add a 'role: string' property to your User schema and populate it.
    // E.g., @Prop({ default: 'user', enum: ['user', 'admin'] }) role: string;
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
