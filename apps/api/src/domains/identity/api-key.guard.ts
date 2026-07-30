import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyAuthGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    const validApiKey = process.env.M2M_API_KEY;

    if (!validApiKey) {
      this.logger.error('M2M_API_KEY is not defined in environment variables. Refusing all M2M connections.');
      throw new UnauthorizedException('Server configuration error');
    }

    if (!apiKey || apiKey !== validApiKey) {
      this.logger.warn(`Intento fallido de autenticación M2M desde ${request.ip}`);
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
