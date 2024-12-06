import { Controller, Get, UseGuards, Req, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './auth.guard';
import { LoginDto, RegisterDto } from './dto/autg.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    return {
      message: 'Authenticated user profile',
      user: req.user, // Retrieved from the guard
    };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
