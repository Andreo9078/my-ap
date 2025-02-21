import { db } from "../electron/services/db.cjs";
import { Role, User } from "../electron/services/auth/models.cjs";
import {
  UsedDetail,
  TechType,
  RequestStatus,
  Comment,
  Detail,
  Request,
} from "../electron/services/requests/models.cjs";

async function sync() {
  try {
    await db.sync({ force: true });
    console.log("Database synced");

    // Создаем роли
    const adminRole = await Role.create({ name: "admin" });
    const clientRole = await Role.create({ name: "client" });
    const masterRole = await Role.create({ name: "master" });
    const managerRole = await Role.create({ name: "manager" });
    console.log("Roles created");

    // Создаем тестовых пользователей
    const users = [
      {
        username: "client",
        password: "client",
        role_id: clientRole.get("id"),
        phone_number: "+79992222222",
        name: "Клиент",
        last_name: "Клиентов",
        patronymic: "Клиентович",
      },
      {
        username: "master",
        password: "master",
        role_id: masterRole.get("id"),
        phone_number: "+79993333333",
        name: "Мастер",
        last_name: "Мастеров",
        patronymic: "Мастерович",
      },
      {
        username: "manager",
        password: "manager",
        role_id: managerRole.get("id"),
        phone_number: "+79994444444",
        name: "Менеджер",
        last_name: "Менеджеров",
        patronymic: "Менеджерович",
      },
    ];

    for (const userData of users) {
      const user = await User.create(userData);
      console.log(`User ${userData.username} created:`, user.toJSON());
    }

    // Создаем статусы заявок
    await RequestStatus.create({ name: "Новая заявка" });
    await RequestStatus.create({ name: "В процессе ремонта" });
    await RequestStatus.create({ name: "Готова к выдаче" });
    await RequestStatus.create({ name: "Отклонена" });
    console.log("Request statuses created");

    // Создаем типы техники
    await TechType.create({ name: "Принтер" });
    await TechType.create({ name: "Компьютер" });
    await TechType.create({ name: "Ноутбук" });
    console.log("Tech types created");

    // Убеждаемся, что модели используются в коде
    console.log("Models loaded:", {
      Detail: !!Detail,
      Comment: !!Comment,
      Request: !!Request,
      UsedDetail: !!UsedDetail,
    });
  } catch (error) {
    console.error("Error during sync:", error);
    throw error;
  }
}

sync().catch(console.error);
