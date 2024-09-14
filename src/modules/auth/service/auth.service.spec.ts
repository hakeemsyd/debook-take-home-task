import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/schema/user.schema';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userModel: any;

  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  const mockUser = {
    _id: 'user_id',
    firstName: 'Hakeem',
    lastName: 'Abbas',
    email: 'hakeem@gmail.com',
    password: 'hashedpassword',
    comparePassword: jest.fn(),
    toObject: jest.fn().mockReturnThis(),
  };

  const mockUserModel = {
    create: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn().mockResolvedValue(mockUser),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('signed_token'),
    verify: jest.fn().mockReturnValue({ email: 'hakeem@gmail.com' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userModel = module.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    it('should register a user and return AuthResponse', async () => {
      jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValueOnce('hashedpassword' as never);
      const signUpDto = {
        firstName: 'Hakeem',
        lastName: 'Abbas',
        email: 'hakeem@gmail.com',
        password: 'password',
      };

      const result = await authService.signUp(signUpDto);

      expect(result).toEqual({
        accessToken: 'signed_token',
        refreshToken: 'signed_token',
        user: expect.objectContaining({
          email: 'hakeem@gmail.com',
        }),
      });
      expect(userModel.create).toHaveBeenCalledWith({
        firstName: 'Hakeem',
        lastName: 'Abbas',
        email: 'hakeem@gmail.com',
        password: 'hashedpassword',
      });
    });
  });

  describe('login', () => {
    it('should log in a user and return AuthResponse', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);

      const loginDto = { email: 'hakeem@gmail.com', password: 'password' };
      const result = await authService.login(loginDto);

      expect(result).toEqual({
        accessToken: 'signed_token',
        refreshToken: 'signed_token',
        user: expect.objectContaining({
          email: 'hakeem@gmail.com',
        }),
      });
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never);
      const loginDto = { email: 'hakeem@gmail.com', password: 'wrongpassword' };

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUserModel.findOne.mockResolvedValueOnce(null);
      const loginDto = { email: 'invalid@example.com', password: 'password' };

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshSession', () => {
    it('should return new tokens when refresh token is valid', async () => {
      const refreshToken = 'valid_refresh_token';

      const result = await authService.refreshSession(refreshToken);

      expect(result).toEqual({
        accessToken: 'signed_token',
        refreshToken: 'signed_token',
      });
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken);
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      (jwtService.verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      await expect(
        authService.refreshSession('invalid_refresh_token'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
