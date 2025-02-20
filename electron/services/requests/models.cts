import { DataTypes } from "sequelize";

import { User } from "../auth/models.cjs";
import { db } from "../db.cjs";

const UsedDetail = db.define(
  "UsedDetail",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "details",
        key: "id",
      },
    },
    request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "requests",
        key: "id",
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "used_details",
    timestamps: false,
  }
);

const TechType = db.define(
  "TechType",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    tableName: "tech_types",
    timestamps: false,
  }
);

const RequestStatus = db.define(
  "RequestStatus",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    tableName: "request_statuses",
    timestamps: false,
  }
);

const Comment = db.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "requests",
        key: "id",
      },
    },

    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "comments",
    timestamps: false,
  }
);

const Detail = db.define(
  "Detail",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    tableName: "details",
    timestamps: false,
  }
);

const Request = db.define(
  "Request",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tech_model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tech_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tech_types",
        key: "id",
      },
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "request_statuses",
        key: "id",
      },
    },
    master_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    master_report: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "requests",
    timestamps: false,
  }
);

// Определяем связи
UsedDetail.belongsTo(Detail, { foreignKey: "detail_id" });
UsedDetail.belongsTo(Request, { foreignKey: "request_id" });
Detail.hasMany(UsedDetail, { foreignKey: "detail_id" });

Comment.belongsTo(Request, { foreignKey: "request_id" });
Comment.belongsTo(User, { foreignKey: "client_id" });
Request.hasMany(Comment, { foreignKey: "request_id", as: "comments" });

Request.belongsTo(TechType, { foreignKey: "tech_type_id" });
Request.belongsTo(RequestStatus, { foreignKey: "status_id" });
Request.belongsTo(User, { foreignKey: "master_id", as: "master" });
Request.belongsTo(User, { foreignKey: "client_id", as: "client" });
Request.hasMany(UsedDetail, { foreignKey: "request_id", as: "used_details" });

export { UsedDetail, TechType, RequestStatus, Comment, Detail, Request };
