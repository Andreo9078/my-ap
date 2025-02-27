import { db } from "../electron/services/db.cjs";
import { Role, User } from "../electron/services/auth/models.cjs";
import {
  UsedDetail,
  TechType,
  RequestStatus,
  Comment,
  Detail,
  Request,
  FaultType,
} from "../electron/services/requests/models.cjs";

async function sync() {
  try {
    await db.sync({ force: true });
    console.log("Database synced");

    // Создаем роли
    const clientRole = await Role.create({ name: "client" });
    const masterRole = await Role.create({ name: "master" });
    const managerRole = await Role.create({ name: "manager" });
    console.log("Roles created");

    // Создаем тестовых пользователей
    const users = [
      {
        username: "client1",
        password: "client1",
        role_id: clientRole.get("id"),
        phone_number: "+79992222221",
        name: "Иван",
        last_name: "Иванов",
        patronymic: "Иванович",
      },
      {
        username: "client2",
        password: "client2",
        role_id: clientRole.get("id"),
        phone_number: "+79992222222",
        name: "Петр",
        last_name: "Петров",
        patronymic: "Петрович",
      },
      {
        username: "client3",
        password: "client3",
        role_id: clientRole.get("id"),
        phone_number: "+79992222223",
        name: "Александр",
        last_name: "Сидоров",
        patronymic: "Александрович",
      },
      {
        username: "master1",
        password: "master1",
        role_id: masterRole.get("id"),
        phone_number: "+79993333331",
        name: "Сергей",
        last_name: "Кузнецов",
        patronymic: "Сергеевич",
      },
      {
        username: "master2",
        password: "master2",
        role_id: masterRole.get("id"),
        phone_number: "+79993333332",
        name: "Дмитрий",
        last_name: "Васильев",
        patronymic: "Дмитриевич",
      },
      {
        username: "master3",
        password: "master3",
        role_id: masterRole.get("id"),
        phone_number: "+79993333333",
        name: "Андрей",
        last_name: "Морозов",
        patronymic: "Андреевич",
      },
      {
        username: "manager1",
        password: "manager1",
        role_id: managerRole.get("id"),
        phone_number: "+79994444441",
        name: "Ольга",
        last_name: "Козлова",
        patronymic: "Олеговна",
      },
      {
        username: "manager2",
        password: "manager2",
        role_id: managerRole.get("id"),
        phone_number: "+79994444442",
        name: "Татьяна",
        last_name: "Орлова",
        patronymic: "Викторовна",
      },
      {
        username: "manager3",
        password: "manager3",
        role_id: managerRole.get("id"),
        phone_number: "+79994444443",
        name: "Елена",
        last_name: "Григорьева",
        patronymic: "Александровна",
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

    // Создаем типы неисправностей
    await FaultType.create({ name: "Сгорела материнская плата" });
    await FaultType.create({ name: "Неисправность клавиатуры" });
    await FaultType.create({ name: "Не работает экран" });
    await FaultType.create({ name: "Перегревается процессор" });
    await FaultType.create({ name: "Не заряжается батарея" });
    await FaultType.create({ name: "Проблемы с Wi-Fi модулем" });
    await FaultType.create({ name: "Компьютер не включается" });
    await FaultType.create({ name: "Шумит вентилятор" });
    await FaultType.create({ name: "Проблемы с USB-портами" });
    await FaultType.create({ name: "Зависает операционная система" });
    await FaultType.create({ name: "Ошибка жесткого диска" });
    await FaultType.create({ name: "Не работает звук" });
    await FaultType.create({ name: "Синий экран смерти (BSOD)" });
    await FaultType.create({ name: "Ошибка видеокарты" });
    await FaultType.create({ name: "Медленно загружается система" });
    await FaultType.create({ name: "Повреждены разъемы питания" });
    await FaultType.create({ name: "Не работает сенсорный экран" });
    await FaultType.create({ name: "Проблемы с Bluetooth" });
    await FaultType.create({ name: "Перегрев видеокарты" });
    await FaultType.create({ name: "Неисправность оперативной памяти" });

    console.log("Fault types created");

    // Создаем тестовые заявки
    // Создаем тестовые заявки
    const requests = [
      {
        client_id: 1,
        tech_type_id: 2, // Компьютер
        tech_model: "Dell Inspiron 15",
        fault_type_id: 1, // Сгорела материнская плата
        status_id: 1, // Новая заявка
        description: "После скачка напряжения компьютер перестал включаться.",
        start_date: "2025-02-01",
        end_date: null,
      },
      {
        client_id: 2,
        master_id: 5,
        tech_type_id: 3, // Ноутбук
        tech_model: "HP Pavilion 14",
        fault_type_id: 5, // Не заряжается батарея
        status_id: 2, // В процессе ремонта
        description:
          "Ноутбук работает только от сети, аккумулятор не заряжается.",
        start_date: "2025-01-28",
        end_date: null,
      },
      {
        client_id: 3,
        master_id: 6,
        tech_type_id: 1, // Принтер
        tech_model: "Epson L3150",
        fault_type_id: 7, // Принтер не включается
        status_id: 3, // Готова к выдаче
        description: "Принтер не реагирует на кнопку включения.",
        start_date: "2025-01-20",
        end_date: "2025-01-30",
      },
      {
        client_id: 1,
        tech_type_id: 2, // Компьютер
        tech_model: "Lenovo ThinkPad X1",
        fault_type_id: 10, // Зависает операционная система
        status_id: 1, // Новая заявка
        description: "Компьютер зависает через 10 минут работы.",
        start_date: "2025-02-05",
        end_date: null,
      },
      {
        client_id: 2,
        master_id: 5,
        tech_type_id: 3, // Ноутбук
        tech_model: "Asus ROG Strix",
        fault_type_id: 14, // Ошибка видеокарты
        status_id: 2, // В процессе ремонта
        description: "Греется видеокарта, артефакты на экране.",
        start_date: "2025-01-26",
        end_date: null,
      },
      {
        client_id: 3,
        master_id: 6,
        tech_type_id: 2, // Компьютер
        tech_model: "MSI Trident 3",
        fault_type_id: 12, // Не работает звук
        status_id: 4, // Отклонена
        description: "Пропал звук после обновления драйверов.",
        start_date: "2025-01-15",
        end_date: "2025-01-18",
      },
      {
        client_id: 1,
        tech_type_id: 3, // Ноутбук
        tech_model: "MacBook Pro 16",
        fault_type_id: 9, // Проблемы с USB-портами
        status_id: 1, // Новая заявка
        description: "Перестали работать USB-порты.",
        start_date: "2025-02-07",
        end_date: null,
      },
      {
        client_id: 2,
        master_id: 5,
        tech_type_id: 1, // Принтер
        tech_model: "Brother HL-L2350DW",
        fault_type_id: 11, // Ошибка памяти принтера
        status_id: 2, // В процессе ремонта
        description: "Принтер выдает ошибку памяти при печати.",
        start_date: "2025-01-27",
        end_date: null,
      },
      {
        client_id: 3,
        master_id: 6,
        tech_type_id: 2, // Компьютер
        tech_model: "Acer Predator Orion 9000",
        fault_type_id: 15, // Медленно загружается система
        status_id: 3, // Готова к выдаче
        description: "Очень долгая загрузка Windows.",
        start_date: "2025-01-22",
        end_date: "2025-01-31",
      },
      {
        client_id: 1,
        tech_type_id: 3, // Ноутбук
        tech_model: "Dell XPS 13",
        fault_type_id: 8, // Шумит вентилятор
        status_id: 1, // Новая заявка
        description: "Громкий шум кулера, даже в простое.",
        start_date: "2025-02-08",
        end_date: null,
      },
      {
        client_id: 2,
        master_id: 5,
        tech_type_id: 2, // Компьютер
        tech_model: "HP Omen 30L",
        fault_type_id: 16, // Повреждены разъемы питания
        status_id: 2, // В процессе ремонта
        description: "Разъем питания разболтался, контакт плохой.",
        start_date: "2025-01-29",
        end_date: null,
      },
      {
        client_id: 3,
        master_id: 6,
        tech_type_id: 3, // Ноутбук
        tech_model: "Lenovo Legion 5",
        fault_type_id: 18, // Проблемы с Bluetooth
        status_id: 3, // Готова к выдаче
        description: "Bluetooth не видит устройства после обновления Windows.",
        start_date: "2025-01-21",
        end_date: "2025-01-28",
      },
      {
        client_id: 1,
        tech_type_id: 1, // Принтер
        tech_model: "Canon PIXMA TS5050",
        fault_type_id: 4, // Перегрев принтера
        status_id: 1, // Новая заявка
        description: "Принтер перегревается после нескольких страниц печати.",
        start_date: "2025-02-09",
        end_date: null,
      },
      {
        client_id: 2,
        master_id: 5,
        tech_type_id: 2, // Компьютер
        tech_model: "Alienware Aurora R12",
        fault_type_id: 20, // Неисправность оперативной памяти
        status_id: 2, // В процессе ремонта
        description: "Компьютер не загружается, выдаёт ошибки памяти.",
        start_date: "2025-01-25",
        end_date: null,
      },
      {
        client_id: 3,
        master_id: 6,
        tech_type_id: 3, // Ноутбук
        tech_model: "Asus ZenBook 14",
        fault_type_id: 19, // Перегрев видеокарты
        status_id: 3, // Готова к выдаче
        description: "Перегрев видеокарты, ноутбук выключается в играх.",
        start_date: "2025-01-23",
        end_date: "2025-01-30",
      },
      {
        client_id: 1,
        tech_type_id: 1, // Принтер
        tech_model: "Xerox Phaser 3020",
        fault_type_id: 3, // Не работает дисплей принтера
        status_id: 1, // Новая заявка
        description:
          "Дисплей принтера не включается, невозможно менять настройки.",
        start_date: "2025-02-10",
        end_date: null,
      },
      {
        client_id: 2,
        master_id: 5,
        tech_type_id: 2, // Компьютер
        tech_model: "Corsair ONE i300",
        fault_type_id: 13, // Синий экран смерти (BSOD)
        status_id: 2, // В процессе ремонта
        description: "Компьютер периодически выдает BSOD с разными ошибками.",
        start_date: "2025-01-24",
        end_date: null,
      },
      {
        client_id: 3,
        master_id: 6,
        tech_type_id: 3, // Ноутбук
        tech_model: "Huawei MateBook D15",
        fault_type_id: 6, // Проблемы с Wi-Fi модулем
        status_id: 3, // Готова к выдаче
        description:
          "Wi-Fi периодически отключается, низкая скорость соединения.",
        start_date: "2025-01-19",
        end_date: "2025-01-27",
      },
    ];

    for (const requestData of requests) {
      const request = await Request.create(requestData);
      console.log(`Request created:`, request.toJSON());
    }

    console.log("Test requests created");

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
