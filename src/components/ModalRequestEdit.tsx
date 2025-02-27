import { Card, Form, Input, Modal, Select, theme } from "antd";
import { useEffect, useState } from "react";
import { useElectronAPI } from "../hooks/useElectronAPI";

interface TechType {
  dataValues: {
    id: number;
    name: string;
  };
}

interface RequestEditProps {
  requestId: number;
  handleCancel: () => void;
  isModalOpen: boolean;
}

export const ModalRequestEdit = ({
  requestId,
  handleCancel,
  isModalOpen,
}: RequestEditProps) => {
  const [form] = Form.useForm();
  const electronAPI = useElectronAPI();
  const [techTypes, setTechTypes] = useState<TechType[]>([]);

  const [techTypeName, setTechTypeName] = useState<string>("");
  const [techModel, setTechModel] = useState<string>("");
  const [description, setDescription] = useState<string>("");

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

    const fetchRequest = async () => {
      const request = await electronAPI.requests.request.getRequest(requestId);
      const techType = await electronAPI.requests.techType.getTechType(
        request.dataValues.tech_type_id
      );
      setTechTypeName(techType.dataValues.name);
      setTechModel(request.dataValues.tech_model);
      setDescription(request.dataValues.description);

      form.setFieldsValue({
        techType: techType.dataValues.id,
        model: request.dataValues.tech_model,
        description: request.dataValues.description,
      });
    };

    fetchTechTypes();
    fetchRequest();
  }, [isModalOpen]);

  const onFinish = async () => {
    const values = await form.validateFields();
    try {
      console.log("Form values:", values);
      const requestData = {
        tech_type_id: Number(values.techType),
        tech_model: values.model,
        description: values.description,
        start_date: new Date(),
        end_date: null,
        master_id: null,
      };

      console.log("Request data:", requestData);

      const newRequest = await electronAPI.requests.request.updateRequest(
        requestId,
        {
          ...requestData,
        }
      );
      console.log("Заявка обнавлена:", newRequest);
      form.resetFields();

      handleCancel();
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при обнавлении заявки:", error);
    }
  };

  return (
    <Modal
      title="Редактирование заявки"
      okText="ОК"
      cancelText="Отмена"
      open={isModalOpen} // Используем open вместо visible
      onOk={onFinish}
      onCancel={() => {
        handleCancel();
      }}
      confirmLoading={false}
    >
      <Card style={{ background: colorBgBase, margin: "30px" }}>
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: 600 }}
          initialValues={{
            techType: techTypeName,
            model: techModel,
            description: description,
          }}
        >
          <Form.Item
            name="techType"
            label="Тип техники"
            rules={[{ required: true, message: "Выберите тип техники" }]}
          >
            <Select
              placeholder="Выберите тип техники"
              defaultValue={techTypeName}
            >
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
            <Input value={techModel} placeholder="Например: HP LaserJet 1020" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание проблемы"
            rules={[{ required: true, message: "Опишите проблему" }]}
          >
            <Input.TextArea
              value={description}
              placeholder="Опишите проблему подробно"
              rows={4}
            />
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};
