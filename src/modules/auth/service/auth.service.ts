import { UnauthorizedException, Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../users/schema/user.schema';

import { SignUpRequest } from '../dto/signup.dto';
import { LoginRequest } from '../dto/login.dto';
import { IAuthService } from './auth.service.interface';
import { AuthResponse } from '../dto/auth-response.dto';
import { RefreshSessionResponse } from '../dto/refresh-session-response.dto';
import { transformUser } from '../../../utils';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async signUp(signUpDto: SignUpRequest): Promise<AuthResponse> {
    this.logger.info('Signing up a new user');
    const { firstName, lastName, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    this.logger.info(`User signed up successfully with ID: ${user._id}`);

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    this.logger.info(`Generated access token for user ID: ${user._id}`);

    return {
      accessToken,
      refreshToken,
      user: transformUser(user),
    };
  }

  async login(loginDto: LoginRequest): Promise<AuthResponse> {
    const { email, password } = loginDto;

    this.logger.info(`Finding user with email: ${email}`);
    const user = await this.userModel.findOne({ email });

    if (!user) {
      this.logger.error(`User not found with email: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      this.logger.error(`Invalid email or password for user: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: transformUser(user), // Transform the user
    };
  }

  async refreshSession(refreshToken: string): Promise<RefreshSessionResponse> {
    try {
      this.logger.info('Refreshing session');
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.userModel.findOne({ email: decoded.email });

      if (!user) {
        this.logger.error('Invalid refresh token');
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      this.logger.info('Session refreshed successfully');

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException(
        error.message || 'Invalid or expired refresh token',
      );
    }
  }

  // Generate access token
  private generateAccessToken(user: User): string {
    const payload = { email: user.email, id: user._id };
    return this.jwtService.sign(payload, { expiresIn: '1d' });
  }

  // Generate refresh token
  private generateRefreshToken(user: User): string {
    const payload = { email: user.email, id: user._id };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }
}
