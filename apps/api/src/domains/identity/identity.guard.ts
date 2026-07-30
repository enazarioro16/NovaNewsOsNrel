import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export interface IIdentityProvider {
  verifyToken(token: string): Promise<boolean>;
}

@Injectable()
export class JwtAuthGuard implements CanActivate, IIdentityProvider {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<any>();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const isValid = await this.verifyToken(token);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido');
    }

    return true;
  }

  async verifyToken(token: string): Promise<boolean> {
    // Abstracción B2C. Aquí validaríamos el JWT de NextAuth / Auth.js
    // Para el Sprint 8 simularemos validación básica
    return token.length > 10; 
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
