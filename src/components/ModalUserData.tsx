import { Button, Card, Modal } from "antd";

import { useElectronAPI } from "../hooks/useElectronAPI";
import { useEffect, useState } from "react";

interface ModalReportProps {
  title?: string;
  onOk?: () => void;
  onClose?: () => void;
  okText?: string;
  userId: number;
}

interface UserData {
  name: string;
  lastName: string;
  patronymic: string;
  phone: string;
}

const ModalUserData: React.FC<ModalReportProps> = ({
  title,
  onOk = () => {},
  onClose = () => {},
  okText = "Ok",
  userId,
}) => {
  const electronAPI = useElectronAPI();
  const [userData, setUserData] = useState<UserData>();

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await electronAPI.auth.user.getUser(userId);
        setUserData({
          name: user.dataValues.name,
          lastName: user.dataValues.last_name,
          patronymic: user.dataValues.patronymic,
          phone: user.dataValues.phone_number,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getUser();
  }, [userId]);

  return (
    <Modal
      title={title}
      open={true}
      okText={okText}
      confirmLoading={false}
      onCancel={onClose}
      onOk={() => {
        console.log("OK!");
      }}
      footer={[
        <Button onClick={onOk} key="submit" type="primary">
          {okText}
        </Button>,
      ]}
    >
      <Card style={{ marginTop: "30px" }}>
        <p>
          ФИО: {userData?.name} {userData?.lastName} {userData?.patronymic}
        </p>
        <p>Телефон: {userData?.phone}</p>
      </Card>
    </Modal>
  );
};

export default ModalUserData;
