import { User } from "./models.cjs";
import {
  CreationAttributes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

interface UserModel
  extends Model<
    InferAttributes<UserModel>,
    InferCreationAttributes<UserModel>
  > {
  id: number;
  username: string;
  password: string;
  phone_number: string;
  name: string;
  last_name: string;
  patronymic: string;
  role_id: number;
}

interface UserFilters {
  roleId?: number;
  username?: string;
  password?: string;
  name?: string;
}

export const userService = {
  async getUser(id: number) {
    const user = await User.findByPk(id);
    return user;
  },
  async getUsers(filters: UserFilters) {
    const where: any = {};

    if (filters?.roleId) {
      where.role_id = filters.roleId;
    }

    if (filters?.name) {
      where.name = filters.name;
    }

    if (filters?.username) {
      where.username = filters.username;
    }

    const users = await User.findAll({
      where,
    });
    return users;
  },
  async createUser(user: CreationAttributes<UserModel>) {
    const newUser = await User.create(user);
    return newUser;
  },

  async updateUser(id: number, user: CreationAttributes<UserModel>) {
    const updatedUser = await User.update(user, { where: { id } });
    return updatedUser;
  },

  async deleteUser(id: number) {
    const deletedUser = await User.destroy({ where: { id } });
    return deletedUser;
  },
};
