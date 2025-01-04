import { Controller, Get, UseGuards, Req, Post, Body, Param, BadRequestException, Res, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './auth.guard';
import { LoginDto, RegisterDto } from './dto/autg.dto';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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

  // New endpoint to activate the account
  @Get('activate/:token')
  async activateAccount(@Param('token') token: string) {
    return this.authService.activateAccount(token);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password/:token')
  async resetPassword(@Param('token') token: string, @Body('newPassword') newPassword: string) {
    if (!newPassword || newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long.');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { uid: string };
      const userId = decoded.uid;

      // Update the user's password (replace with your actual DB logic)
      await this.authService.updatePassword(userId, newPassword);

      return { success: true, message: 'Password reset successful.' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token.');
    }
  }

  @Get('reset-password/:token')
  @Redirect('http://localhost:4001/auth/reset-password/:token', 200)
  async getResetPasswordPage(@Param('token') token: string) {
    return {
      success: true,
      message: 'Token retrieved successfully.',
      resetUrl: `http://localhost:4001/auth/reset-password/${token}`, // Replace with your frontend URL
    };
  }
}
