import { Role } from "./models.cjs";
import {
  CreationAttributes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

interface RoleModel
  extends Model<
    InferAttributes<RoleModel>,
    InferCreationAttributes<RoleModel>
  > {
  id?: number;
  name: string;
}

export const roleService = {
  async getRole(id: number) {
    const role = await Role.findByPk(id);
    return role;
  },

  async getRoles() {
    const roles = await Role.findAll();
    return roles;
  },

  async createRole(role: CreationAttributes<RoleModel>) {
    const newRole = await Role.create(role);
    return newRole;
  },

  async updateRole(id: number, role: CreationAttributes<RoleModel>) {
    const updatedRole = await Role.update(role, { where: { id } });
    return updatedRole;
  },

  async deleteRole(id: number) {
    const deletedRole = await Role.destroy({ where: { id } });
    return deletedRole;
  },
};
