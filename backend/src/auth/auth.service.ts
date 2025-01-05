import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { LoginDto, RegisterDto } from './dto/autg.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly mailerService: MailerService) {
    const firebaseCredentials = Buffer.from(
      process.env.FIREBASE_CRENDENTIALS,
      'base64',
    ).toString('utf-8');

    // Initialize Firebase Admin SDK if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(firebaseCredentials)),
      });
    }
  }

  async verifyToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      return await admin.auth().verifyIdToken(idToken);
    } catch {
      throw new Error('Invalid or expired token.');
    }
  }

  async getUser(uid: string): Promise<admin.auth.UserRecord> {
    try {
      return await admin.auth().getUser(uid);
    } catch {
      throw new Error('User not found.');
    }
  }

  async register(registerDto: RegisterDto) {
    const { email, password, username } = registerDto;

    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: username,
        disabled: true,
      });

      const activationToken = jwt.sign(
        { uid: userRecord.uid },
        process.env.JWT_SECRET, // Add this secret to your .env file
        { expiresIn: '1h' },
      );
      console.log('Template path:', __dirname + '/../src/mailer');

      const activationLink = `http://${process.env.HOST}:${process.env.PORT}/auth/activate/${activationToken}`;
      await this.mailerService.sendMail({
        to: email,
        subject: 'Activate your account',
        template: './activation.hbs', // Path to email template
        context: {
          username,
          activationLink,
        },
      });

      return {
        success: true,
        message:
          'Registration successful. Check your email to activate your account.',
        data: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
        },
      };
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(
        error.message || 'Unable to register user.',
      );
    }
  }

  async activateAccount(token: string) {
    try {
      // Verify the activation token
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        uid: string;
      };
      // Activate the user in Firebase
      const userRecord = await admin.auth().getUser(decoded.uid);
      if (!userRecord.disabled) {
        throw new BadRequestException('Account is already activated.');
      }
      await admin.auth().updateUser(decoded.uid, { disabled: false });
      return {
        success: true,
        message: 'Account successfully activated.',
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Invalid or expired activation token.',
      );
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    try {
      const user = await admin.auth().getUserByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid email or password.');
      }
      const idToken = await admin.auth().createCustomToken(user.uid);
      return {
        success: true,
        message: 'Login successful.',
        token: idToken, // Return a custom token
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        },
      };
    } catch (error) {
      throw new UnauthorizedException(
        error.message || 'Login failed. Please check your credentials.',
      );
    }
  }

  async forgotPassword(email: string): Promise<string> {
    try {
      const user = await admin.auth().getUserByEmail(email);
      if (!user) {
        throw new BadRequestException('No user found with this email.');
      }
      // Generate a reset token
      const resetToken = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour
      });
      // Send the reset email
      const resetLink = `http://${process.env.HOST}:4001/auth/reset-password/${resetToken}`;
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset Your Password',
        template: './reset-password.hbs', // Path to the reset password template
        context: {
          resetLink,
        },
      });
      return 'Password reset email sent successfully.';
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Unable to process forgot password request.',
      );
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<string> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { uid: string };
      const user = await admin.auth().getUser(decoded.uid);
      if (!user) {
        throw new BadRequestException('Invalid or expired reset token.');
      }

      // Use the new updatePassword method
      return await this.updatePassword(user.uid, newPassword);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Invalid or expired reset token.',
      );
    }
  }


  async updatePassword(uid: string, newPassword: string): Promise<string> {
    try {
      if (!newPassword || newPassword.length < 8) {
        throw new BadRequestException('Password must be at least 8 characters long.');
      }
      await admin.auth().updateUser(uid, { password: newPassword });
      return 'Password updated successfully.';
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Unable to update the password. Please try again.',
      );
    }
  }
}
