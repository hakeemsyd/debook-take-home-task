import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserRequest } from '../dto/update-user.dto';
import { IUsersService } from './users.service.interface';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getUser(id: string): Promise<User> {
    this.logger.debug(`Fetching user with ID: ${id}`);
    const user = await this.userModel.findById(id);
    if (!user) {
      this.logger.warn(`User not found with ID: ${id}`);
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserRequest,
  ): Promise<User> {
    this.logger.debug(`Updating user with ID: ${id}`);
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        { new: true, runValidators: true },
      );
      if (!updatedUser) {
        this.logger.warn(`User not found for update with ID: ${id}`);
        throw new Error('User not found');
      }
      return updatedUser;
    } catch (error) {
      this.logger.info(`User updated successfully with ID: ${id}`);
      throw new BadRequestException(error.message || 'User update failed');
    }
  }
}
