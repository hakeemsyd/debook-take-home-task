import { User } from 'src/modules/users/schema/user.schema';

export const transformUser = (user: User): Partial<User> => {
  let userWithoutPassword = user.toObject();
  userWithoutPassword = {
    id: userWithoutPassword._id,
    ...userWithoutPassword,
  };
  delete userWithoutPassword.__v;
  delete userWithoutPassword._id;

  delete userWithoutPassword.password;
  return userWithoutPassword;
};
