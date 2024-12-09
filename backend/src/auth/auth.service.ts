import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { LoginDto, RegisterDto } from './dto/autg.dto';

@Injectable()
export class AuthService {
  constructor() {
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
      });

      return {
        success: true,
        message: 'User registered successfully.',
        data: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Unable to register user.',
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
}
