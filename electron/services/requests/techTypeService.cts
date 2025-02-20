import { TechType } from "./models.cjs";
import {
  CreationAttributes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

interface TechTypeModel
  extends Model<
    InferAttributes<TechTypeModel>,
    InferCreationAttributes<TechTypeModel>
  > {
  id?: number;
  name: string;
}

export const techTypeService = {
  async getTechType(id: number) {
    const techType = await TechType.findByPk(id);
    return techType;
  },

  async getTechTypes(filters: { name?: string }) {
    const where: any = {};

    if (filters?.name) {
      where.name = filters.name;
    }

    const techTypes = await TechType.findAll({
      where,
    });
    return techTypes;
  },

  async createTechType(techType: CreationAttributes<TechTypeModel>) {
    const newTechType = await TechType.create(techType);
    return newTechType;
  },

  async updateTechType(
    id: number,
    techType: CreationAttributes<TechTypeModel>
  ) {
    const updatedTechType = await TechType.update(techType, { where: { id } });
    return updatedTechType;
  },

  async deleteTechType(id: number) {
    const deletedTechType = await TechType.destroy({ where: { id } });
    return deletedTechType;
  },
};
