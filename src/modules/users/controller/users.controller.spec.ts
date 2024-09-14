import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../service/users.service';
import { UpdateUserRequest } from '../dto/update-user.dto';
import { BadRequestException } from '@nestjs/common';
import { User } from '../schema/user.schema';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: Partial<User> = {
    _id: '3be7d258-0152-4b45-83ad-7373718d8821',
    firstName: 'Hakeem',
    lastName: 'Abbas',
    email: 'Hakeem@example.com',
    toObject: jest.fn().mockReturnThis(),
  };

  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  const mockUsersService = {
    getUser: jest.fn(),
    updateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const updateUserDto: UpdateUserRequest = { firstName: 'Hakeem' };
      const updatedUser = { ...mockUser, ...updateUserDto };

      jest.spyOn(service, 'updateUser').mockResolvedValue(updatedUser as User);

      const req = { user: { id: '3be7d258-0152-4b45-83ad-7373718d8821' } };
      const result = await controller.updateProfile(req as any, updateUserDto);

      expect(result).toEqual(
        expect.objectContaining({
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
        }),
      );
      expect(service.updateUser).toHaveBeenCalledWith(
        '3be7d258-0152-4b45-83ad-7373718d8821',
        updateUserDto,
      );
    });

    it('should throw BadRequestException on error', async () => {
      jest
        .spyOn(service, 'updateUser')
        .mockRejectedValue(new Error('Update failed'));

      const req = { user: { id: '3be7d258-0152-4b45-83ad-7373718d8821' } };
      const updateUserDto: UpdateUserRequest = { firstName: 'Hakeem' };

      await expect(
        controller.updateProfile(req as any, updateUserDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('GetUser', () => {
    it('should return a user', async () => {
      jest.spyOn(service, 'getUser').mockResolvedValue(mockUser as User);

      const req = { user: { id: '3be7d258-0152-4b45-83ad-7373718d8821' } };
      const result = await controller.GetUser(req as any);

      expect(result).toEqual(
        expect.objectContaining({
          id: mockUser._id,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email,
        }),
      );
      expect(service.getUser).toHaveBeenCalledWith(
        '3be7d258-0152-4b45-83ad-7373718d8821',
      );
    });
  });
});
