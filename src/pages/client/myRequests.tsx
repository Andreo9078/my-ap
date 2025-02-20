import { useEffect, useState } from "react";
import { useElectronAPI } from "../../hooks/useElectronAPI";
import { RequestCard } from "../../components/requestCard";
import { Button, Modal } from "antd";
import { ModalRequestEdit } from "../../components/ModalRequestEdit";
import { useModalState } from "../../hooks/useModalsState";
import { ModalTextArea } from "../../components/ModalTextArea";
import useRequests from "../../hooks/useRequests";
import useTechTypes from "../../hooks/useTechTypes";
import useStatuses from "../../hooks/useStatuses";

interface MyRequestsProps {
  userId: number | undefined;
}

type ModalState =
  | { type: "edit"; data: { id: number } }
  | { type: "delete"; data: { id: number } }
  | { type: "comment"; data: { id: number } }
  | { type: "watch-comment"; data: { id: number } };

export const MyRequests = ({ userId }: MyRequestsProps) => {
  const electronAPI = useElectronAPI();

  const { requests, update: updateRequests } = useRequests({
    clientId: userId,
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
  }, [modalState]);

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
                {getStatusName(request.status_id) === "Новая" ? (
                  <>
                    <Button
                      type="primary"
                      onClick={() => {
                        openModal("edit", { id: request.id });
                      }}
                    >
                      Редактировать
                    </Button>
                    <Button
                      danger
                      type="primary"
                      onClick={() => {
                        openModal("delete", { id: request.id });
                      }}
                    >
                      Отменить
                    </Button>
                  </>
                ) : (
                  <></>
                )}

                {getStatusName(request.status_id) === "Завершена" ? (
                  commentsMap[request.id] === undefined ||
                  commentsMap[request.id].length === 0 ? (
                    <Button
                      onClick={() => {
                        openModal("comment", { id: request.id });
                      }}
                    >
                      Оставить отзыв
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        openModal("watch-comment", { id: request.id });
                      }}
                    >
                      Мой отзыв
                    </Button>
                  )
                ) : (
                  <></>
                )}
              </RequestCard>
            </div>
          );
        })}
      {modalState && modalState.type === "edit" && (
        <ModalRequestEdit
          requestId={modalState.data.id}
          isModalOpen={true}
          handleCancel={closeModal}
        />
      )}
      {modalState && modalState.type === "delete" && (
        <Modal
          title="Удалить заявку"
          open={true}
          onOk={() => {
            electronAPI.requests.request.deleteRequest(modalState.data.id);
            closeModal();
            window.location.reload();
          }}
          onCancel={closeModal}
        >
          <p>Вы уверены, что хотите удалить заявку?</p>
        </Modal>
      )}
      {modalState && modalState.type === "comment" && (
        <ModalTextArea
          title="Оставить отзыв"
          placeholder="Отзыв"
          onOk={function (text: string): void {
            electronAPI.requests.comment.createComment({
              request_id: modalState.data.id,
              client_id: 2,
              text,
            });
            closeModal();
          }}
          onCancel={function (): void {
            closeModal();
          }}
        />
      )}
      {modalState && modalState.type === "watch-comment" && (
        <ModalTextArea
          title="Ваш отзыв"
          onOk={function (text: string): void {
            console.log(text);
            if (text) {
              electronAPI.requests.comment.updateComment(
                commentsMap[modalState.data.id][0].dataValues.id,
                {
                  text,
                }
              );
            } else {
              electronAPI.requests.comment.deleteComment(
                commentsMap[modalState.data.id][0].dataValues.id
              );
              commentsMap[modalState.data.id].shift();
            }
            closeModal();
          }}
          onCancel={() => closeModal()}
          canselText="Отмена"
          okText="Сохранить"
          defaultText={commentsMap[modalState.data.id][0].dataValues.text}
        />
      )}
    </div>
  );
};
