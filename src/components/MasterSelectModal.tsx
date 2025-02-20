import React, { useEffect, useState } from "react";
import { Modal, Button, Card, Flex } from "antd";
import { useElectronAPI } from "../hooks/useElectronAPI";

interface MasterSelectModalProps {
  requestId: number;
  onClose?: () => void;
}

export const MasterSelectModal: React.FC<MasterSelectModalProps> = ({
  requestId,
  onClose = () => {},
}) => {
  const electronAPI = useElectronAPI();

  const [masters, setMasters] = useState<User[]>();
  const [masterRequestsCountMap, setMasterRequestsCountMap] = useState<
    Map<number, number>
  >(new Map());

  useEffect(() => {
    const fetchMasters = async () => {
      const masters = await electronAPI.auth.user.getUsers({ roleId: 3 });
      setMasters(masters);

      const masterRequestsCountMap = new Map();
      for (const master of masters) {
        const masterRequests = await electronAPI.requests.request.getRequests({
          masterId: master.dataValues.id,
        });
        console.log(masterRequests);
        masterRequestsCountMap.set(master.dataValues.id, masterRequests.length);
      }

      setMasterRequestsCountMap(masterRequestsCountMap);
    };

    fetchMasters();
  }, []);

  return (
    <>
      <Modal
        centered
        title="Доступные мастера"
        open={true}
        onCancel={onClose}
        footer={null}
        width={800}
      >
        <div style={{ maxHeight: "70vh", overflowY: "auto", padding: 16 }}>
          {masters?.map((master) => {
            return (
              <Card size="small">
                <p>
                  ФИО: {master.dataValues.name} {master.dataValues.last_name}{" "}
                  {master.dataValues.patronymic}
                </p>

                <p>Телефон: {master.dataValues.phone_number}</p>

                <p>
                  Количество заказов:{" "}
                  {masterRequestsCountMap.get(master.dataValues.id)}
                </p>

                <Flex justify="end">
                  <Button
                    type="primary"
                    onClick={() => {
                      electronAPI.requests.request.updateRequest(requestId, {
                        master_id: master.dataValues.id,
                        status_id: 2,
                      });
                      onClose();
                    }}
                  >
                    Назначить
                  </Button>
                </Flex>
              </Card>
            );
          })}
        </div>
      </Modal>
    </>
  );
};
