import { RequestStatus } from "./models.cjs";
import {
  CreationAttributes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

interface RequestStatusModel
  extends Model<
    InferAttributes<RequestStatusModel>,
    InferCreationAttributes<RequestStatusModel>
  > {
  id?: number;
  name: string;
}

export const requestStatusService = {
  async getRequestStatus(id: number) {
    const status = await RequestStatus.findByPk(id);
    return status;
  },

  async getRequestStatuses(filters: { name?: string }) {
    const where: any = {};

    if (filters?.name) {
      where.name = filters.name;
    }

    const statuses = await RequestStatus.findAll({
      where,
    });
    return statuses;
  },

  async createRequestStatus(status: CreationAttributes<RequestStatusModel>) {
    const newStatus = await RequestStatus.create(status);
    return newStatus;
  },

  async updateRequestStatus(
    id: number,
    status: CreationAttributes<RequestStatusModel>
  ) {
    const updatedStatus = await RequestStatus.update(status, { where: { id } });
    return updatedStatus;
  },

  async deleteRequestStatus(id: number) {
    const deletedStatus = await RequestStatus.destroy({ where: { id } });
    return deletedStatus;
  },
};
