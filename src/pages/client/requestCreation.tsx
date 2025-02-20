import { Alert, Button, Card, Form, Input, Select, theme } from "antd";
import { useEffect, useState } from "react";
import { useElectronAPI } from "../../hooks/useElectronAPI";
import { CloseSquareFilled } from "@ant-design/icons";
import { useUser } from "../../contexts/currentUserContext";

interface TechType {
  dataValues: {
    id: number;
    name: string;
  };
}

export const RequestCreation = () => {
  const [techTypes, setTechTypes] = useState<TechType[]>([]);
  const [form] = Form.useForm();
  const electronAPI = useElectronAPI();

  const [showAlert, setShowAlert] = useState(false);

  const { user } = useUser();

  const {
    token: { colorBgBase },
  } = theme.useToken();

  useEffect(() => {
    const fetchTechTypes = async () => {
      try {
        const types = await electronAPI.requests.techType.getTechTypes();
        console.log(types);
        setTechTypes(types);
      } catch (error) {
        console.error("Ошибка при загрузке типов техники:", error);
      }
    };

    fetchTechTypes();
  }, []);

  const onFinish = async (values: any) => {
    try {
      if (user) {
        console.log("Form values:", values);
        const requestData = {
          tech_type_id: Number(values.techType),
          tech_model: values.model,
          description: values.description,
          status_id: 1, // ID статуса "Новая"
          client_id: user?.id,
          start_date: new Date(),
          end_date: null,
          master_id: null,
        };

        console.log("Request data:", requestData);

        const newRequest = await electronAPI.requests.request.createRequest({
          ...requestData,
        });
        console.log("Заявка создана:", newRequest);
        setShowAlert(true);
        form.resetFields();
      } else {
        console.error("Unauthorized");
      }
    } catch (error) {
      console.error("Ошибка при создании заявки:", error);
    }
  };

  return (
    <>
      <Card
        style={{ background: colorBgBase, margin: "30px" }}
        title="Создание заявки на ремонт"
      >
        {showAlert && (
          <Alert
            style={{ marginBottom: "20px" }}
            message="Заявка успешно создана"
            type="success"
            banner
            closable={{
              "aria-label": "close",
              closeIcon: <CloseSquareFilled />,
            }}
            onClose={() => setShowAlert(false)}
          />
        )}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          initialValues={{
            techType: undefined,
            model: "",
            description: "",
          }}
        >
          <Form.Item
            name="techType"
            label="Тип техники"
            rules={[{ required: true, message: "Выберите тип техники" }]}
          >
            <Select placeholder="Выберите тип техники">
              {techTypes.map((type) => (
                <Select.Option
                  key={type.dataValues.name}
                  value={type.dataValues.id}
                >
                  {type.dataValues.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="model"
            label="Модель"
            rules={[{ required: true, message: "Введите модель техники" }]}
          >
            <Input placeholder="Например: HP LaserJet 1020" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание проблемы"
            rules={[{ required: true, message: "Опишите проблему" }]}
          >
            <Input.TextArea placeholder="Опишите проблему подробно" rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Создать заявку
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};
