import { useEffect, useState } from "react";
import { useElectronAPI } from "../../hooks/useElectronAPI";
import useRequests from "../../hooks/useRequests";
import useStatuses from "../../hooks/useStatuses";
import useTechTypes from "../../hooks/useTechTypes";
import { useModalState } from "../../hooks/useModalsState";
import { RequestCard } from "../../components/requestCard";
import { Button, Modal, Space } from "antd";
import ModalUserData from "../../components/ModalUserData";
import { MasterSelectModal } from "../../components/MasterSelectModal";
import { ModalDetail } from "../../components/ModalDetail";

// interface NewRequestsProps {
//   userId: number | undefined;
// }

type ModalState =
  | {
      type: "user-data";
      data: { id: number; client_id: number };
    }
  | { type: "master-data"; data: { id: number; master_id: number } }
  | { type: "master-select"; data: { id: number } }
  | { type: "delete"; data: { id: number } }
  | { type: "comment"; data: { id: number } }
  | { type: "report"; data: { id: number } };

export const RequestsList = ({ statusId }: { statusId: number }) => {
  const electronAPI = useElectronAPI();

  const { requests, update: updateRequests } = useRequests({
    statusId: statusId,
  });
  const { techTypes, update: updateTechTypes } = useTechTypes();
  const { statuses, update: updateStatuses } = useStatuses();
  const [commentsMap, setCommentsMap] = useState<Record<number, any[]>>({});

  const { modalState, openModal, closeModal } = useModalState<ModalState>();

  useEffect(() => {
    try {
      updateRequests();
      updateTechTypes();
      updateStatuses();
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  }, [modalState, statusId]);

  useEffect(() => {
    const fetchCommentData = async () => {
      const commentsData: Record<number, any[]> = {};

      for (const request of requests) {
        commentsData[request.id] =
          await electronAPI.requests.comment.getComments({
            request_id: request.id,
          });
      }
      setCommentsMap(commentsData);

      console.log("comments", commentsData);
    };

    fetchCommentData();
  }, [requests]);

  const getTechTypeName = (typeId: number) => {
    const techType = techTypes.find((type) => type.dataValues.id === typeId);
    return techType?.dataValues.name || "Неизвестный тип";
  };

  const getStatusName = (statusId: number) => {
    const status = statuses.find((status) => status.dataValues.id === statusId);
    return status?.dataValues.name || "Неизвестный статус";
  };

  return (
    <div style={{ padding: "5px" }}>
      {requests
        .slice()
        .reverse()
        .map((request: Request) => {
          return (
            <div key={request.id} style={{ margin: "16px" }}>
              <RequestCard
                requestId={request.id.toString()}
                status={getStatusName(request.status_id)}
                techType={getTechTypeName(request.tech_type_id)}
                modelName={request.tech_model}
                description={request.description}
              >
                <Button
                  onClick={() =>
                    openModal("user-data", {
                      id: request.id,
                      client_id: request.client_id,
                    })
                  }
                >
                  Показать данные клиента
                </Button>
                {request.master_id ? (
                  <Button
                    onClick={() =>
                      openModal("master-data", {
                        id: request.id,
                        master_id: request.master_id,
                      })
                    }
                  >
                    Показать данные мастера
                  </Button>
                ) : (
                  <></>
                )}
                {statusId === 1 || statusId === 2 ? (
                  <>
                    <Button
                      type="primary"
                      onClick={() =>
                        openModal("master-select", { id: request.id })
                      }
                    >
                      Назначить мастера
                    </Button>
                    <Button
                      type="primary"
                      danger
                      onClick={() => openModal("delete", { id: request.id })}
                    >
                      Отклонить заявку
                    </Button>
                  </>
                ) : (
                  <></>
                )}
                {statusId === 3 && commentsMap[request.id]?.length !== 0 ? (
                  <Button
                    onClick={() => openModal("comment", { id: request.id })}
                  >
                    Посмотреть комментарий
                  </Button>
                ) : (
                  <></>
                )}
                {statusId === 3 ? (
                  <Button
                    onClick={() => openModal("report", { id: request.id })}
                  >
                    Посмотреть отчет
                  </Button>
                ) : (
                  <></>
                )}
              </RequestCard>
            </div>
          );
        })}
      {modalState?.type == "user-data" && (
        <ModalUserData
          onOk={closeModal}
          userId={modalState.data.client_id}
          onClose={closeModal}
        />
      )}
      {modalState?.type == "master-data" && (
        <ModalUserData
          onOk={closeModal}
          userId={modalState.data.master_id}
          onClose={closeModal}
        />
      )}
      {modalState?.type == "master-select" && (
        <MasterSelectModal
          onClose={closeModal}
          requestId={modalState.data.id}
        />
      )}
      {modalState?.type === "delete" && (
        <Modal
          title="Отклонить заявку"
          open={true}
          onOk={() => {
            electronAPI.requests.request.updateRequest(modalState.data.id, {
              status_id: 4,
            });
            closeModal();
          }}
          onCancel={closeModal}
        >
          <p>Вы уверены, что хотите отклонить заявку?</p>
        </Modal>
      )}
      {modalState?.type === "comment" && (
        <Modal
          title="Комментарий к заявке"
          open={true}
          footer={[
            <Button key="ok" type="primary" onClick={closeModal}>
              ОК
            </Button>,
          ]}
        >
          <>
            <p>{commentsMap[modalState.data.id][0]?.dataValues.text}</p>
          </>
        </Modal>
      )}
      {modalState?.type === "report" && (
        <ModalDetail requestId={modalState.data.id} onClose={closeModal} />
      )}
    </div>
  );
};
