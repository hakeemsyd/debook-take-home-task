import { UpdateUserRequest } from '../dto/update-user.dto';
import { User } from '../schema/user.schema';

export interface IUsersService {
  getUser(id: string): Promise<User>;
  updateUser(id: string, user: UpdateUserRequest): Promise<User>;
}
