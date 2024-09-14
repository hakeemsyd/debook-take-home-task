import {
  Controller,
  Put,
  Body,
  UseGuards,
  Req,
  Get,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UpdateUserRequest } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Request } from 'express';
import { transformUser } from '../../../utils';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../schema/user.schema';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

interface RequestWithUser extends Request {
  user: { id: string };
}

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Profile update failed' })
  @ApiBody({ type: UpdateUserRequest })
  @Put('update')
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserRequest,
  ) {
    this.logger.info(`Updating user profile for user ID: ${req.user.id}`);
    try {
      const userId = req.user.id;
      return transformUser(
        await this.usersService.updateUser(userId, updateUserDto),
      );
    } catch (error) {
      this.logger.error(
        `Error updating user profile for user ID: ${req.user.id}`,
        error,
      );
      throw new BadRequestException(error.message || 'Profile update failed');
    }
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: ' profile fetched successfully',
    type: User,
  })
  @ApiBearerAuth('access-token')
  @Get('get')
  async GetUser(@Req() req: RequestWithUser) {
    this.logger.info(`Fetching user profile for user ID: ${req.user.id}`);
    const userId = req.user.id;
    this.logger.info(
      `User profile fetched successfully for user ID: ${req.user.id}`,
    );
    return transformUser(await this.usersService.getUser(userId));
  }
}
