import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn(),
            login: jest.fn(),
            refreshSession: jest.fn(),
          },
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should throw BadRequestException if registration fails', async () => {
      const signUpDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password',
      };
      jest
        .spyOn(authService, 'signUp')
        .mockRejectedValue(new BadRequestException('Registration failed'));

      await expect(authController.signUp(signUpDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if login fails', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(
          new UnauthorizedException('Invalid email or password'),
        );

      await expect(authController.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshSession', () => {
    it('should throw UnauthorizedException if authorization header is missing', async () => {
      try {
        await authController.refreshSession(undefined);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Refresh token not provided');
      }
    });

    it('should throw UnauthorizedException if authorization header does not start with "Bearer "', async () => {
      try {
        await authController.refreshSession('invalidtoken');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Refresh token not provided');
      }
    });

    it('should throw UnauthorizedException if refresh token is not provided', async () => {
      try {
        await authController.refreshSession('Bearer ');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Refresh token not provided');
      }
    });

    it('should throw UnauthorizedException if refresh fails', async () => {
      jest
        .spyOn(authService, 'refreshSession')
        .mockRejectedValue(new Error('Refresh failed'));

      await expect(
        authController.refreshSession('Bearer validtoken'),
      ).rejects.toThrow(new UnauthorizedException('Refresh failed'));
    });
  });
});
