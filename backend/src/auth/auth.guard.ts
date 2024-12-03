import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header.');
    }

    const token = authHeader.split(' ')[1]; // Extract Bearer token
    if (!token) {
      throw new UnauthorizedException('Invalid authorization header.');
    }

    try {
      const decodedToken = await this.authService.verifyToken(token);
      request.user = decodedToken; // Attach decoded user info to request
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
