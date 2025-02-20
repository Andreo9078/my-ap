import { Sequelize } from "sequelize";

const db = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: console.log,
});

const initDB = async () => {
  try {
    await db.authenticate();
    await db.query("PRAGMA foreign_keys = ON;");
    console.log("Подключение установлено, внешние ключи включены.");
  } catch (error) {
    console.error("Ошибка подключения к базе данных:", error);
    throw error;
  }
};

export { db, initDB };
