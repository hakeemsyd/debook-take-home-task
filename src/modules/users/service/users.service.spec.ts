import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { User } from '../schema/user.schema';
import { UpdateUserRequest } from '../dto/update-user.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  const mockUser = {
    _id: 'someId',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  };

  const mockUserModel = {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockUser);

      const result = await service.getUser('someId');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update and return a user', async () => {
      const updateUserDto: UpdateUserRequest = { firstName: 'Jane' };
      const updatedUser = { ...mockUser, ...updateUserDto };

      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedUser);

      const result = await service.updateUser('someId', updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });
});
