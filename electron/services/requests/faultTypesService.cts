import { FaultType } from "./models.cjs"
import {
  CreationAttributes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

interface FaultTypeModel
  extends Model<
    InferAttributes<FaultTypeModel>,
    InferCreationAttributes<FaultTypeModel>
  > {
  id?: number;
  name: string;
}

export const faultTypesService = {
  async getFaultType(id: number) {
    const faultType = await FaultType.findByPk(id);
    return faultType;
  },

  async getFaultTypes(filters: { name?: string }) {
    const where: any = {};

    if (filters?.name) {
      where.name = filters.name;
    }

    const faultTypes = await FaultType.findAll({
      where,
    });
    return faultTypes;
  },

  async createFaultType(faultType: CreationAttributes<FaultTypeModel>) {
    const newFaultType = await FaultType.create(faultType);
    return newFaultType;
  },

  async updateFaultType(
    id: number,
    faultType: CreationAttributes<FaultTypeModel>
  ) {
    const updatedFaultType = await FaultType.update(faultType, { where: { id } });
    return updatedFaultType;
  },

  async deleteFaultType(id: number) {
    const deletedfaultType = await FaultType.destroy({ where: { id } });
    return deletedfaultType;
  },
};
