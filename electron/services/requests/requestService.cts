import { Request } from "./models.cjs";
import {
  CreationAttributes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

interface RequestModel
  extends Model<
    InferAttributes<RequestModel>,
    InferCreationAttributes<RequestModel>
  > {
  id?: number;
  start_date?: Date | null;
  end_date?: Date | null;
  description: string;
  tech_model: string;
  tech_type_id: number;
  status_id: number;
  master_id?: number | null;
  client_id: number;
  master_report?: string | null;
}

export const requestService = {
  async getRequest(id: number) {
    const request = await Request.findByPk(id);
    return request;
  },

  async getRequests(filters: {
    startDateFrom?: Date;
    startDateTo?: Date;
    endDateFrom?: Date;
    endDateTo?: Date;
    techTypeId?: number;
    statusId?: number;
    masterId?: number;
    clientId?: number;
    techModel?: string;
  }) {
    const where: any = {};

    if (filters?.startDateFrom || filters?.startDateTo) {
      where.start_date = {};
      if (filters.startDateFrom) {
        where.start_date.$gte = filters.startDateFrom;
      }
      if (filters.startDateTo) {
        where.start_date.$lte = filters.startDateTo;
      }
    }

    if (filters?.endDateFrom || filters?.endDateTo) {
      where.end_date = {};
      if (filters.endDateFrom) {
        where.end_date.$gte = filters.endDateFrom;
      }
      if (filters.endDateTo) {
        where.end_date.$lte = filters.endDateTo;
      }
    }

    if (filters?.techTypeId) {
      where.tech_type_id = filters.techTypeId;
    }

    if (filters?.statusId) {
      where.status_id = filters.statusId;
    }

    if (filters?.masterId) {
      where.master_id = filters.masterId;
    }

    if (filters?.clientId) {
      where.client_id = filters.clientId;
    }

    if (filters?.techModel) {
      where.tech_model = filters.techModel;
    }

    const requests = await Request.findAll({
      where,
    });
    return requests;
  },

  async createRequest(request: CreationAttributes<RequestModel>) {
    const newRequest = await Request.create(request);
    return newRequest;
  },

  async updateRequest(id: number, request: CreationAttributes<RequestModel>) {
    const updatedRequest = await Request.update(request, { where: { id } });
    return updatedRequest;
  },

  async deleteRequest(id: number) {
    const deletedRequest = await Request.destroy({ where: { id } });
    return deletedRequest;
  },
};
