import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Inject,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginRequest } from '../dto/login.dto';
import { SignUpRequest } from '../dto/signup.dto';
import { AuthResponse } from '../dto/auth-response.dto';
import { RefreshSessionResponse } from '../dto/refresh-session-response.dto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponse,
  })
  @ApiResponse({ status: 400, description: 'Registration failed' })
  @Post('/signup')
  signUp(@Body() signUpDto: SignUpRequest): Promise<AuthResponse> {
    this.logger.info('Signing up a new user');
    try {
      return this.authService.signUp(signUpDto);
    } catch (error) {
      this.logger.error('Registration failed');
      throw new BadRequestException(error.message || 'Registration failed');
    }
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: AuthResponse,
  })
  @ApiResponse({ status: 401, description: 'Login failed' })
  @Post('/login')
  login(@Body() loginDto: LoginRequest): Promise<AuthResponse> {
    this.logger.info('Logging in a user');
    try {
      return this.authService.login(loginDto);
    } catch (error) {
      this.logger.error('Login failed');
      throw new UnauthorizedException(error.message || 'Login failed');
    }
  }

  @ApiOperation({ summary: 'Refresh a user session' })
  @ApiResponse({
    status: 200,
    description: 'User session refreshed successfully',
    type: RefreshSessionResponse,
  })
  @ApiResponse({ status: 401, description: 'Refresh token failed' })
  @Post('/refresh-session')
  refreshSession(
    @Headers('Authorization') authorization: string,
  ): Promise<RefreshSessionResponse> {
    this.logger.info('Refreshing user session');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      this.logger.error('Refresh token not provided');
      throw new UnauthorizedException('Refresh token not provided');
    }

    const refreshToken = authorization.split(' ')[1];

    if (!refreshToken) {
      this.logger.error('Refresh token not provided');
      throw new UnauthorizedException('Refresh token not provided');
    }

    try {
      return this.authService.refreshSession(refreshToken);
    } catch (error) {
      this.logger.error('Refresh token failed');
      throw new UnauthorizedException(error.message || 'Refresh token failed');
    }
  }
}
