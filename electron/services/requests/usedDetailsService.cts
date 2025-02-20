import { UsedDetail } from "./models.cjs";
import {
  CreationAttributes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

interface UsedDetailsModel
  extends Model<
    InferAttributes<UsedDetailsModel>,
    InferCreationAttributes<UsedDetailsModel>
  > {
  id?: number;
  detail_id: number;
  request_id: number;
  price: number;
  count: number;
}

export const usedDetailsService = {
  async getUsedDetail(id: number) {
    const usedDetail = await UsedDetail.findByPk(id);
    return usedDetail;
  },

  async getUsedDetails(filters: { requestId?: number; detailId?: number }) {
    const where: any = {};

    if (filters?.requestId) {
      where.request_id = filters.requestId;
    }

    if (filters?.detailId) {
      where.detail_id = filters.detailId;
    }

    const usedDetails = await UsedDetail.findAll({
      where,
    });
    return usedDetails;
  },

  async createUsedDetail(usedDetail: CreationAttributes<UsedDetailsModel>) {
    const newUsedDetail = await UsedDetail.create(usedDetail);
    return newUsedDetail;
  },

  async updateUsedDetail(
    id: number,
    usedDetail: CreationAttributes<UsedDetailsModel>
  ) {
    const updatedUsedDetail = await UsedDetail.update(usedDetail, {
      where: { id },
    });
    return updatedUsedDetail;
  },

  async deleteUsedDetail(id: number) {
    const deletedUsedDetail = await UsedDetail.destroy({ where: { id } });
    return deletedUsedDetail;
  },
};
