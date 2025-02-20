import { Comment } from "./models.cjs";
import {
  CreationAttributes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

interface CommentModel
  extends Model<
    InferAttributes<CommentModel>,
    InferCreationAttributes<CommentModel>
  > {
  id?: number;
  text: string;
  request_id: number;
  client_id: number;
  created_at: Date;
}

export const commentService = {
  async getComment(id: number) {
    const comment = await Comment.findByPk(id);
    return comment;
  },

  async getComments(filters: {
    request_id?: number;
    user_id?: number;
    createdFrom?: Date;
    createdTo?: Date;
  }) {
    const where: any = {};

    if (filters?.request_id) {
      where.request_id = filters.request_id;
    }

    if (filters?.user_id) {
      where.user_id = filters.user_id;
    }

    if (filters?.createdFrom || filters?.createdTo) {
      where.created_at = {};
      if (filters.createdFrom) {
        where.created_at.$gte = filters.createdFrom;
      }
      if (filters.createdTo) {
        where.created_at.$lte = filters.createdTo;
      }
    }

    const comments = await Comment.findAll({
      where,
    });
    return comments;
  },

  async createComment(comment: CreationAttributes<CommentModel>) {
    const newComment = await Comment.create(comment);
    return newComment;
  },

  async updateComment(id: number, comment: CreationAttributes<CommentModel>) {
    const updatedComment = await Comment.update(comment, { where: { id } });
    return updatedComment;
  },

  async deleteComment(id: number) {
    const deletedComment = await Comment.destroy({ where: { id } });
    return deletedComment;
  },
};
