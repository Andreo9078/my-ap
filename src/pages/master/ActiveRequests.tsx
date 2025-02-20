import { useState } from "react";
import useRequests from "../../hooks/useRequests";
import useTechTypes from "../../hooks/useTechTypes";
import useStatuses from "../../hooks/useStatuses";
import { RequestCard } from "../../components/requestCard";
import { Button } from "antd";
import { useElectronAPI } from "../../hooks/useElectronAPI";
import { useModalState } from "../../hooks/useModalsState";
import ReportModal from "../../components/ReportModal";

interface ActiveRequestsProps {
  userId?: number;
}

type ModalState = { type: "report"; data: { id: number } };

export const ActiveRequests: React.FC<ActiveRequestsProps> = ({ userId }) => {
  const electronAPI = useElectronAPI();

  const { requests, update: updateRequests } = useRequests({
    masterId: userId,
  });
  const { techTypes, update: updateTechTypes } = useTechTypes();
  const { statuses, update: updateStatuses } = useStatuses();

  const { modalState, openModal, closeModal } = useModalState<ModalState>();

  const getTechTypeName = (typeId: number) => {
    const techType = techTypes.find((type) => type.dataValues.id === typeId);
    return techType?.dataValues.name || "Неизвестный тип";
  };

  const getStatusName = (statusId: number) => {
    const status = statuses.find((status) => status.dataValues.id === statusId);
    return status?.dataValues.name || "Неизвестный статус";
  };

  //TODO вынести в тулзы

  return (
    <>
      {requests.map((request: Request) => {
        return (
          <div key={request.id} style={{ margin: "16px" }}>
            {getStatusName(request.status_id) !== "Завершена" || "Отклонена" ? (
              <RequestCard
                requestId={request.id.toString()}
                status={getStatusName(request.status_id)}
                techType={getTechTypeName(request.tech_type_id)}
                modelName={request.tech_model}
                description={request.description}
              >
                {getStatusName(request.status_id) !== "Завершена" ? (
                  <Button
                    type="primary"
                    onClick={() => {
                      openModal("report", { id: request.id });
                    }}
                  >
                    Завершить
                  </Button>
                ) : undefined}
              </RequestCard>
            ) : undefined}
          </div>
        );
      })}
      ;
      {modalState?.type === "report" && (
        <ReportModal
          requestId={modalState.data.id}
          onCancel={() => {
            closeModal();
            updateRequests();
          }}
        />
      )}
    </>
  );
};
