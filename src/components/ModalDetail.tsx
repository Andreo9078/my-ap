import { useEffect, useState } from "react";
import { useElectronAPI } from "../hooks/useElectronAPI";
import { Button, Card, Modal, Table } from "antd";

interface Report {
  report: string;
  details: { name: string; price: number; count: number }[];
}

interface ModalDetailsPropertis {
  requestId: number;
  onClose: () => void;
}

export const ModalDetail: React.FC<ModalDetailsPropertis> = ({
  requestId,
  onClose,
}) => {
  const electronAPI = useElectronAPI();
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      const detailsNames = await electronAPI.requests.detail.getDetails({});
      console.log("detailNames", detailsNames);
      const request = await electronAPI.requests.request.getRequest(requestId);

      const usedDetails = await electronAPI.requests.usedDetail.getUsedDetails({
        requestId: requestId,
      });
      console.log("usedDetails", usedDetails);
      const tmp = [];
      for (const detail of usedDetails) {
        const name = detailsNames.find(
          (name) => name.dataValues.id == detail.dataValues.detail_id
        )?.dataValues.name;
        tmp.push({
          name,
          price: detail.dataValues.price,
          count: detail.dataValues.count,
        });
      }

      setReport({ report: request.dataValues.master_report, details: tmp });
    };

    fetchReport();
  }, [requestId]);

  const columns = [
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Цена",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Количество",
      dataIndex: "count",
      key: "count",
    },
  ];

  return (
    <Modal
      open={true}
      onCancel={onClose}
      footer={[
        <Button key="ok" type="primary" onClick={onClose}>
          Закрыть
        </Button>,
      ]}
    >
      <Card style={{ marginTop: "30px" }}>
        <p>Отчет: {report?.report}</p>
        <br />
        <p>Использованные детали</p>
        <Table dataSource={report?.details} columns={columns} />;
      </Card>
    </Modal>
  );
};
