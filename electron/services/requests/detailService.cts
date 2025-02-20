import { Detail } from "./models.cjs";
import {
  CreationAttributes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

interface DetailModel
  extends Model<
    InferAttributes<DetailModel>,
    InferCreationAttributes<DetailModel>
  > {
  id?: number;
  name: string;
  description: string;
}

export const detailService = {
  async getDetail(id: number) {
    const detail = await Detail.findByPk(id);
    return detail;
  },

  async getDetails(filters: { name?: string }) {
    const where: any = {};

    if (filters?.name) {
      where.name = filters.name;
    }

    const details = await Detail.findAll({
      where,
    });
    return details;
  },

  async createDetail(detail: CreationAttributes<DetailModel>) {
    const newDetail = await Detail.create(detail);
    return newDetail;
  },

  async updateDetail(id: number, detail: CreationAttributes<DetailModel>) {
    const updatedDetail = await Detail.update(detail, { where: { id } });
    return updatedDetail;
  },

  async deleteDetail(id: number) {
    const deletedDetail = await Detail.destroy({ where: { id } });
    return deletedDetail;
  },
};
