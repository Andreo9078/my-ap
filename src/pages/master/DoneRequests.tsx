import { useState } from "react";
import useRequests from "../../hooks/useRequests";
import useTechTypes from "../../hooks/useTechTypes";
import useStatuses from "../../hooks/useStatuses";
import { RequestCard } from "../../components/requestCard";
import { Button } from "antd";
import { useElectronAPI } from "../../hooks/useElectronAPI";

interface DoneRequestsProps {
  userId?: number;
}

export const DoneRequests: React.FC<DoneRequestsProps> = ({ userId }) => {
  const electronAPI = useElectronAPI();

  const { requests, update: updateRequests } = useRequests({
    masterId: userId,
  });
  const { techTypes, update: updateTechTypes } = useTechTypes();
  const { statuses, update: updateStatuses } = useStatuses();

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
            {getStatusName(request.status_id) === "Завершена" ? (
              <RequestCard
                requestId={request.id.toString()}
                status={getStatusName(request.status_id)}
                techType={getTechTypeName(request.tech_type_id)}
                modelName={request.tech_model}
                description={request.description}
              ></RequestCard>
            ) : undefined}
          </div>
        );
      })}
      ;
    </>
  );
};
