import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useElectronAPI } from "../hooks/useElectronAPI";
import { useEffect, useState } from "react";

interface ModalReportProps {
  title?: string;
  defaultText?: string;
  placeholder?: string;
  disabled?: boolean;
  onCancel?: () => void;
  canselText?: string;
  okText?: string;
  requestId: number;
}

interface FaultType {
  dataValues: {
    id: number;
    name: string;
  };
}

const ReportModal: React.FC<ModalReportProps> = ({
  title,
  onCancel = () => {},
  canselText = "Отмена",
  okText = "ОК",
  requestId,
}) => {
  const electronAPI = useElectronAPI();
  const [form] = Form.useForm();
  const [faultTypes, setVaultTypes] = useState<FaultType[]>([]);

  useEffect(() => {
    const fetchFaultTypes = async () => {
      const types = await electronAPI.requests.faultType.getFaultTypes();
      setVaultTypes(types);
    };

    fetchFaultTypes();
  }, []);

  const onFinish = async () => {
    const values = await form.validateFields();
    console.log(values);

    for (const detail of values.detail_list) {
      console.log(detail);
      const detailDuplicates = await electronAPI.requests.detail.getDetails({
        name: detail.name,
      });
      if (detailDuplicates.length === 1) {
        const detailInDB = detailDuplicates[0];
        await electronAPI.requests.usedDetail.createUsedDetail({
          request_id: requestId,
          detail_id: detailInDB.dataValues.id,
          price: detail.price,
          count: detail.count,
        });
      } else {
        const createdDetail = await electronAPI.requests.detail.createDetail({
          name: detail.name,
        });

        await electronAPI.requests.usedDetail.createUsedDetail({
          request_id: requestId,
          detail_id: createdDetail.dataValues.id,
          price: detail.price,
          count: detail.count,
        });
      }
      const request = await electronAPI.requests.request.getRequest(requestId);
      electronAPI.requests.request.updateRequest(request.dataValues.id, {
        status_id: 3,
        fault_type_id: values.faultType,
        master_report: values.report,
        end_date: new Date(),
      });
    }

    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      width={"80%"}
      height={"80%"}
      title={title}
      open={true}
      cancelText={canselText}
      okText={okText}
      confirmLoading={false}
      onOk={() => {
        onFinish();
      }}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form
        form={form}
        name="dynamic_form_complex"
        autoComplete="off"
        initialValues={{ items: [{}] }}
        style={{ marginTop: 30 }}
      >
        <Form.Item name="items">
          <Card title={"Отчет"} key={"report_card"}>
            <Form.Item style={{ color: "white" }} label="Список деталей">
              <Form.List name={"detail_list"}>
                {(subFields, subOpt) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      rowGap: 16,
                    }}
                  >
                    {subFields.map((subField) => (
                      <Space key={subField.key}>
                        <Form.Item
                          noStyle
                          name={[subField.name, "name"]}
                          rules={[
                            {
                              required: true,
                              message: "Пожалуйста, введите название детали",
                            },
                          ]}
                        >
                          <Input placeholder="Название" />
                        </Form.Item>
                        <Form.Item
                          noStyle
                          name={[subField.name, "price"]}
                          rules={[
                            {
                              required: true,
                              message: "Пожалуйста, введите цену детали",
                            },
                          ]}
                        >
                          <InputNumber placeholder="Цена" min={0} />
                        </Form.Item>
                        <Form.Item noStyle name={[subField.name, "count"]}>
                          <InputNumber placeholder="Количество" min={1} />
                        </Form.Item>
                        <CloseOutlined
                          onClick={() => {
                            subOpt.remove(subField.name);
                          }}
                        />
                      </Space>
                    ))}
                    <Button type="dashed" onClick={() => subOpt.add()} block>
                      Добавить деталь
                    </Button>
                  </div>
                )}
              </Form.List>
            </Form.Item>

            <Form.Item
              name="faultType"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, выберете тип неисправности",
                },
              ]}
            >
              <Select placeholder="Выберите тип неисправности">
                {faultTypes.map((type) => (
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
              label="Отчет"
              name={"report"}
              rules={[{ required: true, message: "Пожалуйста, введите отчет" }]}
            >
              <TextArea />
            </Form.Item>
          </Card>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReportModal;
